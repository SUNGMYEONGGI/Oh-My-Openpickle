export type Message = {id:string; role:'user'|'assistant'; content:string; at:string; demo?:boolean};
export type Conversation = {id:string; title:string; messages:Message[]};
export type Memory = {id:string; content:string; at:string};
export type Task = {id:string; title:string; at:string; repeat:'once'|'daily'; status:'active'|'paused'|'done'};
export type Note = {id:string; title:string; content:string; at:string};
export type Media = {id:string; title:string; mime:'image/png'|'image/jpeg'|'image/webp'; dataUrl:string; at:string};
export type State = {version:1; name:string; color:string; theme:'light'|'dark'|'system'; mode:'demo'|'ollama'; model:string; conversations:Conversation[]; activeId:string; memories:Memory[]; tasks:Task[]; notes:Note[]; media?:Media[]};
export const COLORS = ['#22cd56','#58a3f5','#ad7ae5','#f7a5c6','#f9ca4e','#ed895d'];
export const MAX_STATE_BYTES = 3_000_000;
export const MAX_MEDIA_BYTES = 750_000;
export const freshState = ():State => ({version:1,name:'피클',color:COLORS[0],theme:'light',mode:'demo',model:'',conversations:[{id:'home',title:'기본 채팅',messages:[]}],activeId:'home',memories:[],tasks:[],notes:[]});
export const uid = () => crypto.randomUUID();
const object = (v:unknown):v is Record<string,unknown> => !!v && typeof v==='object' && !Array.isArray(v);
const text = (v:unknown,max:number):v is string => typeof v==='string' && v.length<=max;
const nonempty = (v:unknown,max:number):v is string => text(v,max) && !!v.trim();
const oneOf = (v:unknown,values:readonly string[]):v is string => typeof v==='string' && values.includes(v);
const date = (v:unknown):v is string => text(v,40) && Number.isFinite(Date.parse(v));
const list = (v:unknown,max:number,check:(x:unknown)=>boolean):boolean => Array.isArray(v) && v.length<=max && v.every(check);
const id = (v:unknown):v is string => nonempty(v,80);
const unique = (v:{id:string}[]) => new Set(v.map(x=>x.id)).size===v.length;
function imageData(value:unknown,mime:unknown):boolean {
  if(typeof value!=='string'||value.length>1_000_100||!oneOf(mime,['image/png','image/jpeg','image/webp']))return false;
  const prefix=`data:${mime};base64,`;
  if(!value.startsWith(prefix))return false;
  const encoded=value.slice(prefix.length);
  if(!encoded||encoded.length%4||!/^[A-Za-z0-9+/]+={0,2}$/.test(encoded))return false;
  let bytes:string;
  try{bytes=atob(encoded)}catch{return false}
  if(bytes.length>MAX_MEDIA_BYTES)return false;
  if(mime==='image/png')return bytes.startsWith('\x89PNG\r\n\x1a\n');
  if(mime==='image/jpeg')return bytes.startsWith('\xff\xd8\xff')&&bytes.endsWith('\xff\xd9');
  return bytes.startsWith('RIFF')&&bytes.slice(8,12)==='WEBP';
}
export function parseState(input:unknown):State {
  if (!object(input) || input.version!==1 || !nonempty(input.name,40) || !oneOf(input.color,COLORS) || !oneOf(input.theme,['light','dark','system']) || !oneOf(input.mode,['demo','ollama']) || !text(input.model,120)) throw new Error('지원하지 않는 백업 형식이에요.');
  if (!list(input.conversations,100,c=>object(c) && id(c.id) && nonempty(c.title,120) && list(c.messages,1000,m=>object(m) && id(m.id) && oneOf(m.role,['user','assistant']) && nonempty(m.content,8000) && date(m.at) && (m.demo===undefined || typeof m.demo==='boolean'))) || !list(input.memories,100,m=>object(m) && id(m.id) && nonempty(m.content,2000) && date(m.at)) || !list(input.tasks,100,t=>object(t) && id(t.id) && nonempty(t.title,200) && date(t.at) && oneOf(t.repeat,['once','daily']) && oneOf(t.status,['active','paused','done'])) || !list(input.notes,100,n=>object(n) && id(n.id) && nonempty(n.title,120) && text(n.content,50000) && date(n.at))) throw new Error('백업에 잘못되거나 너무 큰 항목이 있어요.');
  if(input.media!==undefined&&!list(input.media,100,m=>object(m)&&id(m.id)&&nonempty(m.title,120)&&date(m.at)&&imageData(m.dataUrl,m.mime)))throw new Error('미디어에는 750 KB 이하의 PNG, JPEG, WebP 이미지만 저장할 수 있어요.');
  const s=input as State;
  if (!s.conversations.length || !s.conversations.some(c=>c.id===s.activeId) || ![s.conversations,s.memories,s.tasks,s.notes,s.media??[],...s.conversations.map(c=>c.messages)].every(unique)) throw new Error('대화 식별자가 올바르지 않아요.');
  if (new TextEncoder().encode(JSON.stringify(s)).byteLength>MAX_STATE_BYTES || s.memories.reduce((n,m)=>n+m.content.length,0)>20000) throw new Error('백업이 저장 한도를 초과했어요.');
  return s;
}
export function renameConversation(state:State,conversationId:string,title:string):State {
  if(!state.conversations.some(c=>c.id===conversationId))throw new Error('대화를 찾을 수 없어요.');
  if(conversationId==='home')throw new Error('기본 채팅의 이름은 바꿀 수 없어요.');
  const name=title.trim();
  if(!nonempty(name,120))throw new Error('대화 이름은 1~120자로 입력해 주세요.');
  return {...state,conversations:state.conversations.map(c=>c.id===conversationId?{...c,title:name}:c)};
}
export function removeConversation(state:State,conversationId:string):State {
  if(!state.conversations.some(c=>c.id===conversationId))throw new Error('대화를 찾을 수 없어요.');
  if(conversationId==='home')throw new Error('기본 채팅은 삭제할 수 없어요.');
  if(state.conversations.length===1)throw new Error('대화는 하나 이상 남겨 두어야 해요.');
  const conversations=state.conversations.filter(c=>c.id!==conversationId);
  const activeId=state.activeId===conversationId?(conversations.find(c=>c.id==='home')??conversations[0]).id:state.activeId;
  return {...state,conversations,activeId};
}
export function dueTasks(tasks:Task[], now:Date):{tasks:Task[];due:Task[]} {
  const due=tasks.filter(t=>t.status==='active' && Date.parse(t.at)<=now.getTime());
  return {due,tasks:tasks.map(t=>{
    if (!due.includes(t)) return t;
    if (t.repeat==='once') return {...t,status:'done'};
    const next=new Date(t.at);
    next.setDate(next.getDate()+Math.floor((now.getTime()-next.getTime())/86400000));
    while(next<=now) next.setDate(next.getDate()+1);
    return {...t,at:next.toISOString()};
  })};
}
export function downloadFile(name:string,content:string,type='text/plain;charset=utf-8') {
  const url=URL.createObjectURL(new Blob([content],{type}));
  const a=document.createElement('a'); a.href=url; a.download=name; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
