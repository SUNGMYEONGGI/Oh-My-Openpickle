import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,parseState,dueTasks,MAX_STATE_BYTES,renameConversation,removeConversation} from './state.ts';
test('backup round-trip preserves conversations and rejects corrupt or unsafe state',()=>{
 const s=freshState(); assert.deepEqual(parseState(JSON.parse(JSON.stringify(s))),s);
 assert.throws(()=>parseState({...s,activeId:'missing'}));
 assert.throws(()=>parseState({...s,conversations:[...s.conversations,...s.conversations]}));
 assert.throws(()=>parseState({...s,memories:[{id:'x',content:'ok',at:'not a date'}]}));
 assert.throws(()=>parseState({...s,color:'url(https://example.com)'}));
});
test('one-off reminders fire once; daily overdue reminders advance past now',()=>{
 const now=new Date('2026-10-28T10:00:00Z');
 const tasks=[{id:'a',title:'one',at:'2026-10-27T09:00:00Z',repeat:'once',status:'active'},{id:'b',title:'daily',at:'2026-10-26T09:00:00Z',repeat:'daily',status:'active'},{id:'c',title:'paused',at:'2026-10-26T09:00:00Z',repeat:'once',status:'paused'}] as const;
 const r=dueTasks([...tasks],now); assert.equal(r.due.length,2); assert.equal(r.tasks[0].status,'done');
 assert.ok(Date.parse(r.tasks[1].at)>now.getTime()); assert.equal(r.tasks[2].status,'paused'); assert.equal(dueTasks(r.tasks,now).due.length,0);
});
test('backup restoration rejects empty chat messages before they can block subsequent replies',()=>{
 const s=freshState();
 const message={id:'message',role:'assistant' as const,content:'정상 답변',at:'2026-10-29T00:00:00Z'};
 const withContent=(content:string)=>({...s,conversations:[{...s.conversations[0],messages:[{...message,content}]}]});
 assert.equal(parseState(withContent(message.content)).conversations[0].messages[0].content,message.content);
 for(const content of ['',' \n\t '])assert.throws(()=>parseState(withContent(content)));
});
test('backup enum values must be strings so restored reminders retain their behavior',()=>{
 const s=freshState();
 const task={id:'reminder',title:'알림',at:'2026-10-28T00:00:00Z',repeat:'once' as const,status:'active' as const};
 const message={id:'message',role:'user' as const,content:'안녕',at:task.at};
 const restored=parseState({...s,tasks:[task]});
 assert.equal(dueTasks(restored.tasks,new Date('2026-10-29T00:00:00Z')).due.length,1);
 const invalid=[
  {...s,color:[s.color]}, {...s,theme:[s.theme]}, {...s,mode:[s.mode]},
  {...s,conversations:[{...s.conversations[0],messages:[{...message,role:['user']}]}]},
  {...s,tasks:[{...task,repeat:['once']}]}, {...s,tasks:[{...task,status:['active']}]},
 ];
 for(const backup of invalid)assert.throws(()=>parseState(JSON.parse(JSON.stringify(backup))));
});
test('Korean backups use the same UTF-8 byte budget as file import',()=>{
 const s=freshState();
 s.notes=Array.from({length:19},(_,i)=>({id:String(i),title:'기록',content:'한'.repeat(50000),at:'2026-10-28T00:00:00Z'}));
 const accepted=parseState(s);
 const compact=JSON.stringify(accepted);
 assert.ok(new TextEncoder().encode(compact).byteLength<=MAX_STATE_BYTES);
 assert.deepEqual(parseState(JSON.parse(compact)),accepted);
 const tooLarge={...s,notes:[...s.notes,{id:'twentieth',title:'기록',content:'한'.repeat(50000),at:'2026-10-28T00:00:00Z'}]};
 assert.ok(JSON.stringify(tooLarge).length<MAX_STATE_BYTES);
 assert.throws(()=>parseState(tooLarge),/저장 한도/);
});
test('adding chat or timer messages cannot pass the shared total or message-count bounds',()=>{
 const s=freshState();
 s.notes=Array.from({length:59},(_,i)=>({id:String(i),title:'note',content:'a'.repeat(50000),at:'2026-10-28T00:00:00Z'}));
 s.notes.push({id:'last',title:'note',content:'',at:'2026-10-28T00:00:00Z'});
 s.notes.at(-1)!.content='a'.repeat(MAX_STATE_BYTES-new TextEncoder().encode(JSON.stringify(s)).byteLength);
 parseState(s);
 const message={id:'incoming',role:'assistant' as const,content:'새 답변',at:'2026-10-28T00:00:00Z'};
 const appended={...s,conversations:[{...s.conversations[0],messages:[message]}]};
 assert.throws(()=>parseState(appended),/저장 한도/);
 assert.equal(s.conversations[0].messages.length,0);
 const full=freshState();
 full.conversations[0].messages=Array.from({length:1000},(_,i)=>({...message,id:String(i)}));
 parseState(full);
 const overflow={...full,conversations:[{...full.conversations[0],messages:[...full.conversations[0].messages,message]}]};
 assert.throws(()=>parseState(overflow));
 assert.equal(full.conversations[0].messages.length,1000);
});
test('renaming trims a valid title while retaining the selected chat and its history',()=>{
 const s=freshState();
 s.conversations.push({id:'trip',title:'여행',messages:[{id:'m1',role:'user',content:'여행 준비',at:'2026-10-29T00:00:00Z'}]});
 s.activeId='trip';
 const renamed=parseState(renameConversation(s,'trip','  제주 여행  '));
 assert.equal(renamed.conversations[1].title,'제주 여행');
 assert.equal(renamed.activeId,'trip');
 assert.deepEqual(renamed.conversations[1].messages,s.conversations[1].messages);
 assert.equal(s.conversations[1].title,'여행');
 assert.equal(renameConversation(s,'trip','가'.repeat(120)).conversations[1].title.length,120);
 for(const title of ['','   ','가'.repeat(121)])assert.throws(()=>renameConversation(s,'trip',title));
 assert.throws(()=>renameConversation(s,'home','새 이름'));
 assert.throws(()=>renameConversation(s,'missing','새 이름'));
});
test('deleting the active chat selects home and deleting another chat retains selection',()=>{
 const s=freshState();
 s.conversations.unshift({id:'first',title:'첫 대화',messages:[]});
 s.conversations.push({id:'active',title:'현재 대화',messages:[]});
 s.activeId='active';
 const removed=parseState(removeConversation(s,'active'));
 assert.equal(removed.activeId,'home');
 assert.deepEqual(removed.conversations.map(c=>c.id),['first','home']);
 assert.equal(removeConversation(s,'first').activeId,'active');
 assert.equal(s.conversations.length,3);
 assert.throws(()=>removeConversation(s,'home'));
 assert.throws(()=>removeConversation(s,'missing'));
});
test('imported chats without home retain a valid selection and cannot lose the last chat',()=>{
 const s={...freshState(),conversations:[{id:'first',title:'첫 대화',messages:[]},{id:'active',title:'현재 대화',messages:[]}],activeId:'active'};
 const removed=parseState(removeConversation(s,'active'));
 assert.equal(removed.activeId,'first');
 assert.throws(()=>removeConversation(removed,'first'));
 assert.equal(removed.conversations.length,1);
});
test('optional local media preserves legacy backups and admits bounded raster data only',()=>{
 const legacy=freshState();
 assert.equal(parseState(JSON.parse(JSON.stringify(legacy))).media,undefined);
 const image={id:'image',title:'사진.png',mime:'image/png' as const,at:'2026-10-29T00:00:00Z',dataUrl:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aFGkAAAAASUVORK5CYII='};
 assert.deepEqual(parseState({...legacy,media:[image]}).media,[image]);
 for(const dataUrl of ['https://example.com/photo.png','data:image/svg+xml;base64,PHN2Zy8+','data:image/png;base64,PHN2Zy8+','data:image/png;base64,not base64','data:image/jpeg;base64,/9j//9k='])
  assert.throws(()=>parseState({...legacy,media:[{...image,dataUrl}]}));
 assert.throws(()=>parseState({...legacy,media:[image,image]}));
 assert.throws(()=>parseState({...legacy,media:[{...image,mime:'image/svg+xml'}]}));
 assert.throws(()=>parseState({...legacy,media:[{...image,mime:['image/png']}]}));
 const large='data:image/png;base64,'+Buffer.concat([Buffer.from('\x89PNG\r\n\x1a\n','latin1'),Buffer.alloc(750_000)]).toString('base64');
 assert.throws(()=>parseState({...legacy,media:[{...image,dataUrl:large}]}));
 const sizeable='data:image/png;base64,'+Buffer.concat([Buffer.from('\x89PNG\r\n\x1a\n','latin1'),Buffer.alloc(740_000)]).toString('base64');
 assert.throws(()=>parseState({...legacy,media:Array.from({length:4},(_,i)=>({...image,id:String(i),dataUrl:sizeable}))}),/저장 한도/);
});
