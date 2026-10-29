'use client';
import {useEffect,useRef,useState} from 'react';
import type {Conversation,Message} from '@/lib/state';
import Character from './Character';
import Icon from './Icon';
import Modal from './Modal';
type Recognition = {lang:string;interimResults:boolean;onresult:((e:{results:{transcript:string}[][]})=>void)|null;onend:(()=>void)|null;onerror:(()=>void)|null;start:()=>void;stop:()=>void};
type Props={conversation:Conversation;name:string;color:string;draft:string;setDraft:(s:string)=>void;busy:boolean;mode:string;onSend:()=>void;onSave:(m:Message)=>void;onRemember:(m:Message)=>void;onStop:()=>void;onSettings:()=>void;onArchive:()=>void};
export default function Chat({conversation,name,color,draft,setDraft,busy,mode,onSend,onSave,onRemember,onStop,onSettings,onArchive}:Props) {
 const composer=useRef<HTMLTextAreaElement>(null);
 const end=useRef<HTMLDivElement>(null),recognition=useRef<Recognition|null>(null),hold=useRef<ReturnType<typeof setTimeout>|null>(null);
 const [voice,setVoice]=useState(false),[hint,setHint]=useState(''),[menu,setMenu]=useState<Message|null>(null),[attach,setAttach]=useState(false),[voiceMenu,setVoiceMenu]=useState(false);
 useEffect(()=>{end.current?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})},[conversation.messages.length,busy]);
 useEffect(()=>{setMenu(null)},[conversation.id]);
 useEffect(()=>()=>{recognition.current?.stop();window.speechSynthesis?.cancel();if(hold.current)clearTimeout(hold.current)},[]);
 function cancelHold(){if(hold.current)clearTimeout(hold.current);hold.current=null}
 function dictate(){
  setVoiceMenu(false);
  const Ctor=(window as unknown as {SpeechRecognition?:new()=>Recognition;webkitSpeechRecognition?:new()=>Recognition}).SpeechRecognition || (window as unknown as {webkitSpeechRecognition?:new()=>Recognition}).webkitSpeechRecognition;
  if(!Ctor){setHint('이 환경은 받아쓰기를 지원하지 않아요. Chrome에서 사용할 수 있어요.');return}
  if(voice){recognition.current?.stop();return}
  const r=new Ctor();recognition.current=r;r.lang='ko-KR';r.interimResults=false;r.onresult=e=>setDraft(e.results[0][0].transcript);r.onend=()=>setVoice(false);r.onerror=()=>{setHint('마이크 권한과 음성 인식 지원을 확인해 주세요.');setVoice(false)};
  try{r.start();setVoice(true);setHint('듣고 있어요. 인식된 문장은 보내기 전에 확인할 수 있어요.')}catch{setVoice(false);setHint('받아쓰기를 시작하지 못했어요.')}
 }
 function speak(){setVoiceMenu(false);const last=conversation.messages.findLast(m=>m.role==='assistant');if(!last){setHint('읽어 줄 답변이 아직 없어요.');return}if(!window.speechSynthesis){setHint('이 환경은 음성 읽기를 지원하지 않아요.');return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(last.content);u.lang='ko-KR';speechSynthesis.speak(u)}
 async function copy(m:Message){try{await navigator.clipboard.writeText(m.content);setHint('메시지를 복사했어요.');setMenu(null)}catch{setHint('복사하지 못했어요. 메시지의 텍스트를 직접 선택해 주세요.');setMenu(null)}}
 function reply(m:Message){const quote=`> ${m.content.replaceAll('\n','\n> ')}\n\n`;if(quote.length>8000){setMenu(null);setHint('인용할 내용이 너무 길어요. 메시지의 일부를 복사해 주세요.');return}setDraft(quote);setMenu(null);requestAnimationFrame(()=>composer.current?.focus())}
 return <div className="chat-workspace"><div className="messages" role="log" aria-label="대화 내용" aria-live="polite">
 {!conversation.messages.length?<div className="welcome"><Character color={color} large/><h1>안녕, 나는 {name}이야.</h1><p>어떤 이야기부터 시작해 볼까?</p><div className="starter-list">{['오늘 하루 계획을 같이 세워 줘','내가 좋아하는 것들을 기억해 줘','복잡한 생각을 정리하고 싶어'].map(t=><button key={t} onClick={()=>setDraft(t)}>{t}<Icon name="chevron" size={16}/></button>)}</div></div>:<><div className="date-divider">{new Date(conversation.messages[0].at).toLocaleDateString('ko-KR',{month:'long',day:'numeric'})}</div>{conversation.messages.map((m,i)=><article key={m.id} className={`message ${m.role}`}><div className="message-bubble" onContextMenu={e=>{e.preventDefault();setMenu(m)}} onPointerDown={e=>{if(e.pointerType==='touch'){cancelHold();hold.current=setTimeout(()=>setMenu(m),400)}}} onPointerUp={cancelHold} onPointerCancel={cancelHold} onPointerMove={cancelHold}>{m.content}</div><div className="message-meta"><time>{new Date(m.at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})}</time>{m.demo&&<span>데모</span>}<button className="message-more" aria-label={`메시지 메뉴 열기 ${i+1}`} aria-haspopup="dialog" onClick={()=>setMenu(m)}><Icon name="more" size={16}/></button></div></article>)}</>}
 {busy&&<div className="thinking-message"><span/><span/><span/><small>{name}이 생각 중이에요</small></div>}<div ref={end}/></div>
 <div className="composer-area">{hint&&<div className="inline-notice" role="status">{hint}<button aria-label="안내 닫기" onClick={()=>setHint('')}><Icon name="close" size={14}/></button></div>}
 <form className="composer" onSubmit={e=>{e.preventDefault();onSend()}}>
 <button type="button" className="icon-button attach-button" aria-label="첨부 메뉴" aria-haspopup="dialog" onClick={()=>setAttach(true)}><Icon name="plus" size={23}/></button>
 <textarea ref={composer} value={draft} onChange={e=>setDraft(e.target.value)} rows={1} maxLength={8000} placeholder="메시지 보내기" aria-label="메시지 보내기" onKeyDown={e=>{if(e.key==='Enter'&&!e.shiftKey&&!e.nativeEvent.isComposing){e.preventDefault();if(!busy)onSend()}}}/>
 {busy?<button type="button" className="send-button" aria-label="응답 중지" onClick={onStop}><Icon name="pause" size={18}/></button>:draft.trim()?<button className="send-button" aria-label="메시지 전송"><Icon name="arrow" size={20}/></button>:<button type="button" className={`voice-button ${voice?'recording':''}`} aria-label="음성 메뉴" onClick={()=>setVoiceMenu(true)}><Icon name="spectrum" size={24}/></button>}
 </form><button className="provider-note" onClick={onSettings}><span className={mode==='ollama'?'status-dot':''}/>{mode==='demo'?'데모 모드 · AI 연결':'Ollama · 내 컴퓨터의 AI'}<Icon name="chevron" size={10}/></button></div>
 {menu&&<Modal title="메시지" variant="sheet" onClose={()=>setMenu(null)}><p className="message-menu-preview">{menu.content.slice(0,180)}{menu.content.length>180?'…':''}</p><div className="action-list"><button onClick={()=>copy(menu)}><Icon name="copy"/>복사</button><button onClick={()=>reply(menu)}><Icon name="reply"/>답장</button><button onClick={()=>{onSave(menu);setMenu(null)}}><Icon name="archive"/>보관함에 저장</button><button onClick={()=>{onRemember(menu);setMenu(null)}}><Icon name="bubble"/>함께한 추억에 기억하기</button></div></Modal>}
 {attach&&<Modal title="첨부" variant="sheet" onClose={()=>setAttach(false)}><div className="action-list"><button onClick={()=>{setAttach(false);onArchive()}}><Icon name="archive"/>보관함 열기</button></div><p className="sheet-note">문서와 이미지는 보관함에서 가져올 수 있어요. 현재 대화의 AI에는 이미지가 전달되지 않아요.</p></Modal>}
 {voiceMenu&&<Modal title="음성" variant="sheet" onClose={()=>setVoiceMenu(false)}><div className="action-list"><button onClick={dictate}><Icon name="mic"/>{voice?'받아쓰기 중지':'받아쓰기'}</button><button onClick={speak}><Icon name="volume"/>최근 답변 읽기</button></div><p className="sheet-note">브라우저의 음성 기능을 사용해요. 실시간 통화는 지원하지 않아요.</p></Modal>}
 </div>;
}
