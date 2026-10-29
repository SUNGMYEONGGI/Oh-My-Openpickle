'use client';
import {useId,useState} from 'react';
import type {State} from '@/lib/state';
import Character from './Character';
import CharacterEditor from './CharacterEditor';
import Icon from './Icon';
import {Memories,Tasks,type Update} from './WorkspacePanels';

const sections=[{id:'done',label:'한 일',icon:'tasks'},{id:'scheduled',label:'예약한 작업',icon:'clock'},{id:'memories',label:'함께한 추억',icon:'bubble'}] as const;

export default function CharacterProfile({state,update,onChat}:{state:State;update:Update;onChat:()=>void}) {
  const [section,setSection]=useState<(typeof sections)[number]['id']>('done'),[edit,setEdit]=useState(false);
  const id=useId();
  const completed=state.tasks.filter(task=>task.status==='done').sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
  return <section className="panel character-profile">
    <header className="character-profile-header"><div className="character-profile-avatar"><Character color={state.color}/><button className="character-profile-edit" aria-label="피클 이름과 모습 바꾸기" onClick={()=>setEdit(true)}><Icon name="edit" size={18}/></button></div><h1>{state.name}</h1><p>{state.mode==='demo'?'로컬 데모로 함께하고 있어요':'이야기할 준비가 됐어요'}</p></header>
    <div className="character-segments" role="tablist" aria-label="피클의 기록">{sections.map((item,index)=><button key={item.id} id={`${id}-${item.id}`} role="tab" aria-selected={section===item.id} aria-controls={`${id}-panel`} tabIndex={section===item.id?0:-1} onClick={()=>setSection(item.id)} onKeyDown={e=>{let next=index;if(e.key==='ArrowRight')next=(index+1)%sections.length;else if(e.key==='ArrowLeft')next=(index+sections.length-1)%sections.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=sections.length-1;else return;e.preventDefault();setSection(sections[next].id);e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[next]?.focus();}}><span><Icon name={item.icon} size={item.id==='done'?21:item.id==='scheduled'?16:17}/></span>{item.label}</button>)}</div>
    <div className="character-profile-content" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${section}`}>
      {section==='done'&&<div className="completed-tasks">{completed.length?<><p className="context-note">예약 알림을 채팅으로 전달한 기록이에요.</p>{completed.map((task,index)=>{const date=new Date(task.at).toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'});const previous=index?new Date(completed[index-1].at).toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'}):null;return <div key={task.id}>{date!==previous&&<h2 className="task-date-heading">{date}</h2>}<article className="completed-task-row"><span className="completed-task-icon"><Icon name="check" size={19}/></span><div><h3>{task.title}</h3><p>알림 전달 완료 · 예약 시각 <time>{new Date(task.at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})}</time></p></div></article></div>})}</>:<div className="empty completed-empty"><Icon name="tasks" size={54}/><h3>아직 완료한 일이 없어요</h3><p>예약한 알림을 전달하면<br/>여기에서 다시 볼 수 있어요.</p><button className="primary-button" onClick={onChat}>대화하기</button></div>}</div>}
      {section==='scheduled'&&<Tasks state={state} update={update} embedded/>}
      {section==='memories'&&<Memories state={state} update={update} embedded/>}
    </div>
    {edit&&<CharacterEditor state={state} update={update} onClose={()=>setEdit(false)}/>}
  </section>;
}
