'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {type State,type Message,freshState,parseState,uid,dueTasks,downloadFile,renameConversation,removeConversation} from '@/lib/state';
import Icon,{type IconName} from './Icon';
import Character from './Character';
import Chat from './Chat';
import Profile from './Profile';
import CharacterProfile from './CharacterProfile';
import Modal from './Modal';
import {Archive,Explore,Memories,Tasks} from './WorkspacePanels';
type Page='chat'|'explore'|'archive'|'profile'|'memories'|'tasks'|'character';
const tabs:{id:Page;label:string;icon:IconName}[]=[{id:'chat',label:'채팅',icon:'chat'},{id:'explore',label:'둘러보기',icon:'compass'},{id:'archive',label:'보관함',icon:'archive'},{id:'profile',label:'나의 피클',icon:'user'}];
const KEY='pickle-local-v1';
export default function PickleApp(){
 const [state,setState]=useState<State>(freshState),[ready,setReady]=useState(false),[page,setPage]=useState<Page>('chat'),[returnPage,setReturnPage]=useState<Page>('chat'),[drawer,setDrawer]=useState(false),[draft,setDraft]=useState(''),[busy,setBusy]=useState(false),[toast,setToast]=useState(''),[storageError,setStorageError]=useState(''),[search,setSearch]=useState(''),[notice,setNotice]=useState<string|null>(null),[manage,setManage]=useState<{id:string;title:string;remove:boolean}|null>(null);
 const controller=useRef<AbortController|null>(null),current=useRef(state),sending=useRef(false),storageBlocked=useRef(false),loadFailed=useRef(false),lastTaskFailure=useRef<State|null>(null);current.current=state;
 const notify=useCallback((s:string)=>setToast(s),[]);
 useEffect(()=>{try{const stored=localStorage.getItem(KEY);if(stored){const loaded=parseState(JSON.parse(stored));current.current=loaded;setState(loaded)}}catch{storageBlocked.current=true;loadFailed.current=true;setStorageError('저장 데이터를 읽지 못했어요. 원본을 보존하고 변경 저장을 멈췄어요. 백업을 가져오거나 저장을 다시 시도해 주세요.')}setReady(true)},[]);
 useEffect(()=>{document.documentElement.dataset.theme=state.theme},[state.theme]);
 useEffect(()=>{if(!toast)return;const timer=setTimeout(()=>setToast(''),4500);return()=>clearTimeout(timer)},[toast]);
 const commit=useCallback((input:State,recover=false)=>{
  let next:State;
  try{next=parseState(input)}catch(e){notify(e instanceof Error?e.message:'저장할 내용을 확인해 주세요.');return false}
  if(storageBlocked.current&&!recover){notify('저장 문제를 해결한 뒤 다시 저장해 주세요. 입력한 내용은 아직 반영하지 않았어요.');return false}
  try{
   if(recover){const raw=localStorage.getItem(KEY);downloadFile('pickle-before-recovery.json',raw??JSON.stringify(current.current),'application/json')}
   localStorage.setItem(KEY,JSON.stringify(next));
  }catch{storageBlocked.current=true;setStorageError('저장 공간이 부족하거나 저장 권한이 없어요. 변경 내용을 반영하지 않았어요. 기존 데이터를 보관한 뒤 저장을 다시 시도해 주세요.');notify('저장하지 못했어요. 입력한 내용을 확인하고 다시 시도해 주세요.');return false}
  current.current=next;setState(next);storageBlocked.current=false;loadFailed.current=false;setStorageError('');lastTaskFailure.current=null;return true;
 },[notify]);
 const update=useCallback((fn:(s:State)=>State)=>{try{return commit(fn(current.current))}catch(e){notify(e instanceof Error?e.message:'저장할 내용을 확인해 주세요.');return false}},[commit,notify]);
 useEffect(()=>{if(!ready)return;const timer=setInterval(()=>{
  const s=current.current;if(storageBlocked.current||lastTaskFailure.current===s)return;
  const {tasks,due}=dueTasks(s.tasks,new Date());if(!due.length)return;
  if(!update(()=>({...s,tasks,conversations:s.conversations.map(c=>c.id===s.activeId?{...c,messages:[...c.messages,...due.map(t=>({id:uid(),role:'assistant' as const,content:`⏰ 예약한 시간이에요.\n${t.title}`,at:new Date().toISOString()}))]}:c)})))lastTaskFailure.current=s;
 },1000);return()=>clearInterval(timer)},[ready,update]);
 useEffect(()=>()=>controller.current?.abort(),[]);
 const conversation=state.conversations.find(c=>c.id===state.activeId)!;
 function navigate(p:Page){if(['character','memories','tasks'].includes(p)&&!['character','memories','tasks'].includes(page))setReturnPage(page);setPage(p);setDrawer(false)}
 function newChat(){if(state.conversations.length>=100){notify('대화는 최대 100개까지 만들 수 있어요.');return}const id=uid();if(update(s=>({...s,conversations:[...s.conversations,{id,title:'새로운 대화',messages:[]}],activeId:id}))){setDraft('');navigate('chat')}}
 async function send(){
  const content=draft.trim();if(!content||sending.current)return;
  const s=current.current,c=s.conversations.find(c=>c.id===s.activeId)!;
  if(c.messages.length>=998){notify('이 대화가 가득 찼어요. 새 대화를 시작해 주세요.');return}
  const message:Message={id:uid(),role:'user',content,at:new Date().toISOString()};
  if(!update(s=>({...s,conversations:s.conversations.map(x=>x.id===c.id?{...x,title:x.id!=='home'&&!x.messages.length?content.slice(0,30):x.title,messages:[...x.messages,message]}:x)})))return;
  setDraft('');setBusy(true);sending.current=true;
  const abort=new AbortController();controller.current=abort;
  try{
   // Keep the recent context within the local API's bounded request contract.
   const recent=[...c.messages,message].slice(-60);while(recent.reduce((n,m)=>n+m.content.length,0)>50000)recent.shift();
   const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode:s.mode,model:s.model,name:s.name,memories:s.memories.map(m=>m.content),messages:recent.map(({role,content})=>({role,content}))}),signal:abort.signal});
   const data=await r.json();if(!r.ok)throw new Error(data.error||'답변을 가져오지 못했어요.');
   if(abort.signal.aborted)return;
   const reply:Message={id:uid(),role:'assistant',content:data.reply,at:new Date().toISOString(),demo:data.mode==='demo'};
   update(prev=>({...prev,conversations:prev.conversations.map(x=>x.id===c.id?{...x,messages:[...x.messages,reply]}:x)}));
  }catch(e){if(abort.signal.aborted){notify('응답을 중지했어요.')}else{notify(e instanceof Error?e.message:'연결을 확인해 주세요.');if(current.current.activeId===c.id)setDraft(d=>d||content)}}finally{setBusy(false);sending.current=false;controller.current=null}
 }
 function saveMessage(m:Message){if(state.notes.length>=100){notify('문서 저장 한도는 100개예요.');return}if(update(s=>({...s,notes:[{id:uid(),title:m.content.slice(0,40).replace(/\n/g,' '),content:m.content,at:new Date().toISOString()},...s.notes]})))notify('보관함에 저장했어요.')}
 function remember(m:Message){if(state.memories.length>=100||m.content.length>2000||state.memories.reduce((n,x)=>n+x.content.length,0)+m.content.length>20000){notify('짧게 정리한 내용으로 추억을 추가해 주세요.');return}if(update(s=>({...s,memories:[{id:uid(),content:m.content,at:new Date().toISOString()},...s.memories]})))notify('함께한 추억에 기억했어요.')}
 function restore(next:State){if(!commit(next,true))return false;controller.current?.abort();setDraft('');return true}
 function retryStorage(){try{const next=loadFailed.current?parseState(JSON.parse(localStorage.getItem(KEY)??'null')):current.current;if(commit(next,true))notify('원본을 백업하고 저장을 다시 시작했어요.')}catch{notify('기존 데이터를 아직 읽을 수 없어요. 원본을 보존한 뒤 유효한 백업을 가져와 주세요.')}}
 const navigation=<>
  <button className="drawer-person" onClick={()=>navigate('character')}><Character color={state.color}/><strong>{state.name}</strong><Icon name="chevron" size={16}/></button>
  <label className="history-search"><Icon name="search" size={18}/><input aria-label="대화 검색" placeholder="검색" value={search} onChange={e=>setSearch(e.target.value)}/></label>
  <nav className="sidebar-nav" aria-label="주 메뉴">
   <button aria-current={page==='chat'?'page':undefined} onClick={()=>{if(update(s=>({...s,activeId:s.conversations.find(c=>c.id==='home')?.id||s.activeId})))navigate('chat')}}><Icon name="chat"/>기본 채팅</button>
   <button onClick={()=>setNotice('친구')}><Icon name="people"/>친구</button>
   <button aria-current={page==='explore'?'page':undefined} onClick={()=>navigate('explore')}><Icon name="compass"/>둘러보기</button>
   <button aria-current={page==='archive'?'page':undefined} onClick={()=>navigate('archive')}><Icon name="archive"/>보관함</button>
   <button onClick={()=>setNotice('3D 월드')}><Icon name="world"/>3D 월드<span className="unavailable-dot"/></button>
   <button aria-current={page==='profile'?'page':undefined} onClick={()=>navigate('profile')}><Icon name="user"/>나의 피클</button>
  </nav>
  <div className="history-heading">추가 대화<button className="icon-button" aria-label="새로운 대화" onClick={newChat}><Icon name="plus" size={19}/></button></div>
  <div className="history-list">{state.conversations.filter(c=>(c.id!=='home'||!!search)&&(c.title.includes(search)||c.messages.some(m=>m.content.includes(search)))).map(c=><div key={c.id} className={`history-row ${c.id===state.activeId&&page==='chat'?'selected':''}`}><button onClick={()=>{if(update(s=>({...s,activeId:c.id}))){setDraft('');navigate('chat')}}}><Icon name="chat" size={18}/><span>{c.title}</span></button>{c.id!=='home'&&<button className="conversation-options" aria-label={`${c.title} 대화 관리`} onClick={()=>setManage({id:c.id,title:c.title,remove:false})}><Icon name="more" size={18}/></button>}</div>)}</div>
  <a className="drawer-about" href="/">Oh-My-Picklebot 소개<Icon name="chevron" size={14}/></a>
 </>;
 if(!ready)return <div className="loading"><Character/><p>피클을 만나러 가는 중…</p></div>;
 return <div className="app-shell"><main className={`main-view ${page==='profile'?'soft-page':''}`}>
 <header className={`app-header ${['character','memories','tasks'].includes(page)?'subpage-header':''}`}>
  {['character','memories','tasks'].includes(page)?<button className="round-button" aria-label="뒤로 가기" onClick={()=>navigate(returnPage)}><Icon name="back"/></button>:<button className="round-button menu-toggle" aria-label="메뉴 열기" aria-expanded={drawer} aria-haspopup="dialog" onClick={()=>setDrawer(true)}><Icon name="menu"/></button>}
  {!['character','memories','tasks'].includes(page)&&<><button className="header-identity" aria-label="피클 프로필 열기" onClick={()=>navigate('character')}><span><Character color={state.color} thinking={busy}/></span><strong>{state.name}{busy&&<small>생각 중이에요…</small>}</strong></button>
  <button className="header-action" onClick={()=>setNotice('초대')}>초대</button></>}
 </header>
 {storageError&&<div className="storage-warning" role="alert">{storageError}<button onClick={()=>downloadFile('pickle-recovery.json',JSON.stringify(state),'application/json')}>현재 데이터 내보내기</button><button onClick={()=>{try{const raw=localStorage.getItem(KEY);if(raw)downloadFile('pickle-original.json',raw,'application/json')}catch{notify('기존 저장소에 접근할 수 없어요.')}}}>기존 데이터 보존</button><button onClick={retryStorage}>원본 백업 후 저장 재시도</button></div>}
 <div key={page} className={`page-body ${page==='chat'?'is-chat':''}`}>
 {page==='chat'?<Chat conversation={conversation} name={state.name} color={state.color} draft={draft} setDraft={setDraft} busy={busy} mode={state.mode} onSend={send} onSave={saveMessage} onRemember={remember} onStop={()=>controller.current?.abort()} onSettings={()=>navigate('profile')} onArchive={()=>navigate('archive')}/>:page==='explore'?<Explore onChoose={t=>{setDraft(t);navigate('chat')}}/>:page==='archive'?<Archive state={state} update={update} notify={notify}/>:page==='memories'?<Memories state={state} update={update}/>:page==='tasks'?<Tasks state={state} update={update}/>:page==='character'?<CharacterProfile state={state} update={update} onChat={()=>navigate('chat')}/>:<Profile state={state} update={update} onRestore={restore} notify={notify} onMemories={()=>navigate('memories')} onTasks={()=>navigate('tasks')}/>}
 </div>
 {!['character','memories','tasks'].includes(page)&&<nav className="bottom-nav" aria-label="탭 막대">{tabs.map(t=><button key={t.id} aria-label={t.label} aria-current={page===t.id?'page':undefined} onClick={()=>navigate(t.id)}><Icon name={t.icon} selected={page===t.id} size={24}/><span>{t.label}</span></button>)}</nav>}
 </main>
 {drawer&&<Modal title="메뉴" variant="drawer" onClose={()=>setDrawer(false)}><div className="drawer-content">{navigation}</div></Modal>}
 {manage&&<Modal title={manage.remove?'대화를 삭제할까요?':'대화 관리'} variant="sheet" onClose={()=>setManage(null)}>{manage.remove?<><p>“{manage.title}”의 메시지가 모두 삭제돼요. 필요한 내용은 먼저 백업해 주세요.</p><div className="form-actions"><button className="subtle-button" onClick={()=>setManage({...manage,remove:false})}>취소</button><button className="primary-button danger-fill" onClick={()=>{if(update(s=>removeConversation(s,manage.id))){setManage(null);notify('대화를 삭제했어요.')}}}>대화 삭제</button></div></>:<form onSubmit={e=>{e.preventDefault();if(update(s=>renameConversation(s,manage.id,manage.title))){setManage(null);notify('대화 이름을 변경했어요.')}}}><label>대화 이름<input value={manage.title} maxLength={120} required onChange={e=>setManage({...manage,title:e.target.value})}/></label><div className="form-actions"><button type="button" className="subtle-button danger" onClick={()=>setManage({...manage,remove:true})}><Icon name="trash" size={16}/> 삭제</button><button className="primary-button" disabled={!manage.title.trim()}>이름 저장</button></div></form>}</Modal>}
 {notice&&<Modal title={notice} variant="sheet" onClose={()=>setNotice(null)}><div className="feature-unavailable"><Icon name={notice==='3D 월드'?'world':'people'} size={42}/><h3>{notice==='3D 월드'?'3D 월드는 아직 준비 중이에요':'친구 연결은 아직 준비 중이에요'}</h3><p>{notice==='3D 월드'?'이 버전에서는 채팅과 추억, 문서 보관을 사용할 수 있어요.':'현재는 내 기기에 저장하는 개인용 앱이에요. 다른 사람에게 초대가 전송되지는 않아요.'}</p><button className="primary-button" onClick={()=>setNotice(null)}>확인</button></div></Modal>}
 {toast&&<div role="status" className="toast"><Icon name="check" size={18}/>{toast}<button aria-label="알림 닫기" onClick={()=>setToast('')}><Icon name="close" size={15}/></button></div>}
 </div>;
}
