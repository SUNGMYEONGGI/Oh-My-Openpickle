'use client';
import {useEffect,useRef,useState} from 'react';
import {type State,type Task,type Note,type Media,MAX_MEDIA_BYTES,uid,downloadFile} from '@/lib/state';
import Icon,{type IconName} from './Icon';
import Modal from './Modal';
export type Update=(fn:(s:State)=>State)=>boolean;
function Empty({icon,title,body}:{icon:'bubble'|'clock'|'archive'|'image'|'compass';title:string;body:string}){return <div className="empty"><Icon name={icon} size={42}/><h3>{title}</h3><p>{body}</p></div>}
function localDay(at:string){const d=new Date(at);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
export function Memories({state,update,embedded=false}:{state:State;update:Update;embedded?:boolean}){
 const [edit,setEdit]=useState<string|null>(null),[content,setContent]=useState(''),[search,setSearch]=useState(''),[selectedDate,setSelectedDate]=useState('');
 const items=state.memories.filter(m=>m.content.toLowerCase().includes(search.toLowerCase())&&(!selectedDate||localDay(m.at)===selectedDate)).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
 const days=[...new Set(items.map(m=>localDay(m.at)))];
 return <section className={`panel ${embedded?'panel-embedded':''}`}>
  <div className={embedded?'embedded-actions':'page-heading'}>{!embedded&&<div><h1>함께한 추억</h1><p>피클이 기억했으면 하는 이야기</p></div>}<button className="round-button" aria-label="추억 추가" disabled={state.memories.length>=100} onClick={()=>{setEdit('new');setContent('')}}><Icon name="plus"/></button></div>
  <div className="memory-filters"><label className="search-field"><Icon name="search" size={18}/><input aria-label="추억 검색" placeholder="기억 속에서 찾아보기" value={search} onChange={e=>setSearch(e.target.value)}/></label><div className="memory-date-filter"><label>추억 날짜<input type="date" value={selectedDate} onInput={e=>setSelectedDate(e.currentTarget.value)} onChange={e=>setSelectedDate(e.target.value)}/></label><button className="subtle-button" aria-pressed={!selectedDate} onClick={()=>setSelectedDate('')}>전체 날짜</button></div></div>
  {!items.length?<Empty icon="bubble" title={search||selectedDate?'조건에 맞는 추억이 없어요':'우리의 이야기를 모아 볼까요?'} body={search||selectedDate?'다른 날짜나 검색어로 찾아보세요.':'좋아하는 것, 중요한 일, 잊고 싶지 않은 순간을 남겨 주세요.'}/>:<div className="memory-date-groups">{days.map(day=>{const group=items.filter(m=>localDay(m.at)===day);return <section className="memory-date-group" key={day}><h2 className="memory-date-heading"><time dateTime={day}>{new Date(group[0].at).toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'})}</time></h2><div className="memory-list">{group.map(m=><button className="memory-card" key={m.id} onClick={()=>{setEdit(m.id);setContent(m.content)}}><span className="memory-icon"><Icon name="bubble"/></span><p>{m.content}</p><time dateTime={m.at}>{new Date(m.at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'})}</time></button>)}</div></section>})}</div>}
  {edit&&<Modal title={edit==='new'?'새로운 추억':'추억 편집'} onClose={()=>setEdit(null)}><form onSubmit={e=>{e.preventDefault();const t=content.trim();if(!t)return;if(update(s=>({...s,memories:edit==='new'?[{id:uid(),content:t,at:new Date().toISOString()},...s.memories]:s.memories.map(m=>m.id===edit?{...m,content:t}:m)})))setEdit(null)}}><label>기억할 이야기<textarea required maxLength={2000} value={content} onChange={e=>setContent(e.target.value)} autoFocus rows={6}/></label><div className="form-actions">{edit!=='new'&&<button type="button" className="subtle-button danger" onClick={()=>{if(update(s=>({...s,memories:s.memories.filter(m=>m.id!==edit)})))setEdit(null)}}>삭제</button>}<button className="primary-button" disabled={!content.trim()}>기억하기</button></div></form></Modal>}
 </section>
}
export function Tasks({state,update,embedded=false}:{state:State;update:Update;embedded?:boolean}){
 const [edit,setEdit]=useState<string|null>(null),[title,setTitle]=useState(''),[at,setAt]=useState(''),[repeat,setRepeat]=useState<'once'|'daily'>('once'),[filter,setFilter]=useState('active');
 const tasks=state.tasks.filter(t=>filter==='done'?t.status==='done':t.status!=='done').sort((a,b)=>Date.parse(a.at)-Date.parse(b.at));
 const groups=filter==='done'?[{id:'done',label:'완료한 일',items:tasks}]:[{id:'once',label:'한 번 예약',items:tasks.filter(t=>t.status==='active'&&t.repeat==='once')},{id:'daily',label:'반복 예약',items:tasks.filter(t=>t.status==='active'&&t.repeat==='daily')},{id:'paused',label:'일시 중지',items:tasks.filter(t=>t.status==='paused')}];
 const open=(t?:Task)=>{const d=t?new Date(t.at):new Date(Date.now()+3600000);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());setAt(d.toISOString().slice(0,16));setTitle(t?.title||'');setRepeat(t?.repeat||'once');setEdit(t?.id||'new')};
 return <section className={`panel ${embedded?'panel-embedded':''}`}><div className={embedded?'embedded-actions':'page-heading'}>{!embedded&&<div><h1>예약한 일</h1><p>미래의 나에게 보내는 작은 알림</p></div>}<button className="round-button" aria-label="예약 추가" disabled={state.tasks.length>=100} onClick={()=>open()}><Icon name="plus"/></button></div><div className="segmented">{[['active','예정된 일'],['done','완료한 일']].map(([v,l])=><button key={v} aria-pressed={filter===v} onClick={()=>setFilter(v)}>{l}</button>)}</div><p className="context-note"><Icon name="clock" size={14}/> 앱이 열려 있을 때 채팅으로 알려드려요.</p>
  {!tasks.length?<Empty icon="clock" title="아직 예약된 일이 없어요" body="물 마시기, 책 읽기, 중요한 약속. 잊지 않도록 함께 챙겨요."/>:<div className="schedule-groups">{groups.filter(g=>g.items.length).map(group=><section className="schedule-group" key={group.id}><h2 className="schedule-group-heading">{group.label}<span>{group.items.length}</span></h2>{group.items.map(t=><div className="task-card" key={t.id}><span className={`task-icon ${t.status}`}><Icon name={t.status==='done'?'check':'clock'}/></span><button className="task-info" onClick={()=>open(t)}><strong>{t.title}</strong><span>{new Date(t.at).toLocaleString('ko-KR',{month:'long',day:'numeric',hour:'2-digit',minute:'2-digit'})} · {t.repeat==='daily'?'매일':'한 번'}{t.status==='paused'?' · 일시 중지':''}</span></button>{t.status!=='done'&&<button className="icon-button" aria-label={t.status==='active'?'예약 일시 중지':'예약 재개'} onClick={()=>update(s=>({...s,tasks:s.tasks.map(x=>x.id===t.id?{...x,status:x.status==='active'?'paused':'active'}:x)}))}><Icon name={t.status==='active'?'pause':'play'} size={18}/></button>}</div>)}</section>)}</div>}
  {edit&&<Modal title="예약한 일" onClose={()=>setEdit(null)}><form onSubmit={e=>{e.preventDefault();const item:Task={id:edit==='new'?uid():edit,title:title.trim(),at:new Date(String(new FormData(e.currentTarget).get('at'))).toISOString(),repeat,status:'active'};if(update(s=>({...s,tasks:edit==='new'?[...s.tasks,item]:s.tasks.map(t=>t.id===edit?item:t)})))setEdit(null)}}><label>무엇을 알려드릴까요?<input required maxLength={200} value={title} onChange={e=>setTitle(e.target.value)} autoFocus placeholder="잠깐 쉬면서 물 마시기"/></label><label>날짜와 시간<input required name="at" type="datetime-local" value={at} onChange={e=>setAt(e.target.value)}/></label><label>반복<select value={repeat} onChange={e=>setRepeat(e.target.value as 'once'|'daily')}><option value="once">한 번만</option><option value="daily">매일</option></select></label><div className="form-actions">{edit!=='new'&&<button type="button" className="subtle-button danger" onClick={()=>{if(update(s=>({...s,tasks:s.tasks.filter(t=>t.id!==edit)})))setEdit(null)}}>삭제</button>}<button className="primary-button" disabled={!title.trim()||!at}>예약 저장</button></div></form></Modal>}
 </section>
}
export function Archive({state,update,notify}:{state:State;update:Update;notify:(s:string)=>void}) {
 const [tab,setTab]=useState<'notes'|'media'>('notes'),[create,setCreate]=useState(false),[edit,setEdit]=useState<Note|null>(null),[opened,setOpened]=useState<{kind:'note'|'media';id:string}|null>(null),[search,setSearch]=useState(''),[uploading,setUploading]=useState(false);
 const textInput=useRef<HTMLInputElement>(null),imageInput=useRef<HTMLInputElement>(null);
 const media=state.media??[];
 const notes=state.notes.filter(n=>(n.title+n.content).toLowerCase().includes(search.toLowerCase())).sort((a,b)=>Date.parse(b.at)-Date.parse(a.at));
 const day=(at:string)=>new Date(at).toLocaleDateString('ko-KR',{year:'numeric',month:'long',day:'numeric'});
 const days=[...new Set(notes.map(n=>day(n.at)))];
 const selectedNote=opened?.kind==='note'?state.notes.find(n=>n.id===opened.id):undefined;
 const selectedMedia=opened?.kind==='media'?media.find(m=>m.id===opened.id):undefined;
 async function uploadText(file:File|undefined) {
  if(!file||uploading)return;
  if(file.size>50000){notify('텍스트 파일은 50 KB까지 가져올 수 있어요.');return}
  if(state.notes.length>=100){notify('문서는 최대 100개까지 저장할 수 있어요.');return}
  setUploading(true);
  try{setEdit({id:uid(),title:file.name.slice(0,120),content:await file.text(),at:new Date().toISOString()});setCreate(false)}
  catch{notify('파일을 읽지 못했어요.')}
  finally{setUploading(false)}
 }
 async function uploadImage(file:File|undefined) {
  if(!file||uploading)return;
  if(!['image/png','image/jpeg','image/webp'].includes(file.type)||!file.size||file.size>MAX_MEDIA_BYTES){notify('750 KB 이하의 PNG, JPEG, WebP 이미지를 선택해 주세요.');return}
  if(media.length>=100){notify('이미지는 최대 100개까지 저장할 수 있어요.');return}
  setUploading(true);
  try{
   const dataUrl=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>typeof reader.result==='string'?resolve(reader.result):reject(new Error());reader.onerror=()=>reject(new Error());reader.readAsDataURL(file)});
   const preview=new Image();preview.src=dataUrl;await preview.decode();
   if(preview.naturalWidth*preview.naturalHeight>16_000_000){notify('이미지는 1,600만 화소 이하로 가져와 주세요.');return}
   const image:Media={id:uid(),title:file.name.slice(0,120),mime:file.type as Media['mime'],dataUrl,at:new Date().toISOString()};
   if(update(s=>({...s,media:[image,...(s.media??[])]}))){setCreate(false);setTab('media');notify('이미지를 보관함에 저장했어요.')}
  }catch{notify('이미지를 읽지 못했어요. 다른 파일을 선택해 주세요.')}
  finally{setUploading(false)}
 }
 function newDocument(){setCreate(false);setEdit({id:uid(),title:'',content:'',at:new Date().toISOString()})}
 function downloadImage(image:Media){const a=document.createElement('a');a.href=image.dataUrl;a.download=image.title;a.click()}
 return <section className="panel archive-panel">
  <div className="page-heading"><h1>보관함</h1></div>
  <div className="segmented archive-segments" aria-label="보관함 종류"><button aria-pressed={tab==='notes'} onClick={()=>setTab('notes')}>아티팩트</button><button aria-pressed={tab==='media'} onClick={()=>setTab('media')}>미디어</button></div>
  {tab==='notes'?<>
   {!!state.notes.length&&<label className="search-field archive-search"><Icon name="search" size={18}/><input aria-label="문서 검색" placeholder="문서 검색" value={search} onChange={e=>setSearch(e.target.value)}/></label>}
   {!notes.length?<Empty icon="archive" title={search?'검색 결과가 없어요':'아직 생성한 문서가 없어요'} body={search?'다른 검색어로 찾아보세요.':'피클하고 함께 필요한 문서나 기록을 만들어 보세요.'}/>:<div className="archive-groups">{days.map(date=><section key={date}><h2 className="archive-date">{date}</h2>{notes.filter(n=>day(n.at)===date).map(n=><div className="archive-row" key={n.id} onContextMenu={e=>{e.preventDefault();setOpened({kind:'note',id:n.id})}}><button className="archive-row-main" onClick={()=>setOpened({kind:'note',id:n.id})}><span className="archive-thumb"><Icon name="file" size={28}/></span><span><strong>{n.title}</strong><small>{n.content.replace(/\s+/g,' ').slice(0,65)||'텍스트 문서'}</small></span></button><button className="icon-button archive-row-menu" aria-label={`${n.title} 문서 메뉴`} onClick={()=>setOpened({kind:'note',id:n.id})}><Icon name="more" size={18}/></button></div>)}</section>)}</div>}
  </>:!media.length?<Empty icon="image" title="아직 저장한 미디어가 없어요" body="사진을 가져와 피클과 함께한 순간을 보관해 보세요."/>:<div className="archive-media-grid">{media.map(m=><button className="archive-media-cell" key={m.id} onClick={()=>setOpened({kind:'media',id:m.id})} aria-label={`${m.title} 열기`}><img src={m.dataUrl} alt={m.title}/></button>)}</div>}
  <button className="round-button archive-create" aria-label="만들기" onClick={()=>setCreate(true)}><Icon name="plus" size={26}/></button>
  <input ref={textInput} type="file" accept=".txt,.md,text/plain,text/markdown" hidden onChange={e=>{void uploadText(e.target.files?.[0]);e.target.value=''}}/>
  <input ref={imageInput} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e=>{void uploadImage(e.target.files?.[0]);e.target.value=''}}/>
  {create&&<Modal title="만들기" variant="sheet" onClose={()=>setCreate(false)}><div className="archive-create-options"><button disabled={uploading||state.notes.length>=100} onClick={newDocument}><Icon name="file" size={26}/><span><strong>문서</strong><small>생각을 정리하고 기록해요</small></span><Icon name="chevron" size={18}/></button><button disabled={uploading||media.length>=100} onClick={()=>imageInput.current?.click()}><Icon name="image" size={26}/><span><strong>이미지 가져오기</strong><small>기기에 있는 사진을 보관해요</small></span><Icon name="chevron" size={18}/></button></div><button className="subtle-button full" disabled={uploading||state.notes.length>=100} onClick={()=>textInput.current?.click()}>텍스트 파일 가져오기</button><p className="context-note">{uploading?'파일을 확인하고 있어요.':'이미지는 PNG, JPEG, WebP · 파일당 750 KB까지 가져올 수 있어요.'}</p></Modal>}
  {selectedNote&&<Modal title={selectedNote.title} variant="sheet" onClose={()=>setOpened(null)}><article className="archive-detail"><time>{day(selectedNote.at)}</time><p>{selectedNote.content||'아직 내용이 없어요.'}</p></article><div className="form-actions"><button className="subtle-button" onClick={()=>downloadFile(`${selectedNote.title}.md`,selectedNote.content)}><Icon name="download" size={17}/>다운로드</button><button className="subtle-button danger" onClick={()=>{if(update(s=>({...s,notes:s.notes.filter(n=>n.id!==selectedNote.id)})))setOpened(null)}}>삭제</button><button className="primary-button" onClick={()=>{setEdit({...selectedNote});setOpened(null)}}>편집</button></div></Modal>}
  {selectedMedia&&<Modal title={selectedMedia.title} variant="sheet" onClose={()=>setOpened(null)}><figure className="archive-media-detail"><img src={selectedMedia.dataUrl} alt={selectedMedia.title}/><figcaption>{day(selectedMedia.at)}</figcaption></figure><div className="form-actions"><button className="subtle-button danger" onClick={()=>{if(update(s=>({...s,media:(s.media??[]).filter(m=>m.id!==selectedMedia.id)})))setOpened(null)}}>삭제</button><button className="primary-button" onClick={()=>downloadImage(selectedMedia)}><Icon name="download" size={17}/>다운로드</button></div></Modal>}
  {edit&&<Modal title="문서 편집" variant="sheet" onClose={()=>setEdit(null)}><form onSubmit={e=>{e.preventDefault();const n={...edit,title:edit.title.trim()};if(update(s=>({...s,notes:s.notes.some(x=>x.id===n.id)?s.notes.map(x=>x.id===n.id?n:x):[n,...s.notes]}))){setEdit(null);setTab('notes');setOpened({kind:'note',id:n.id})}}}><label>제목<input required maxLength={120} value={edit.title} onChange={e=>setEdit({...edit,title:e.target.value})} autoFocus placeholder="새로운 문서"/></label><label>내용<textarea rows={10} maxLength={50000} value={edit.content} onChange={e=>setEdit({...edit,content:e.target.value})} placeholder="마음에 떠오른 것을 적어 보세요."/></label><div className="form-actions"><button type="button" className="subtle-button" onClick={()=>downloadFile(`${edit.title||'문서'}.md`,edit.content)}>내보내기</button><button className="primary-button" disabled={!edit.title.trim()}>저장</button></div></form></Modal>}
 </section>;
}

type Suggestion={id:string;icon:IconName;category:string;title:string;description:string;steps:string[];prompt:string};
const suggestions:Suggestion[]=[
 {id:'budget',icon:'wallet',category:'돈',title:'한 달 지출을 한눈에 정리해요',description:'고정 지출과 가끔 쓰는 돈을 나눠, 나에게 맞는 예산을 생각해 봐요.',steps:['이번 달에 정리할 범위를 정해요.','지출을 몇 가지 항목으로 나눠요.','다음 달에 조정할 부분을 함께 찾아요.'],prompt:'한 달 지출을 정리하고 싶어. 금액을 한 번에 요구하지 말고 항목부터 함께 정해 줘.'},
 {id:'shopping',icon:'bag',category:'쇼핑',title:'사기 전에, 내 기준부터 정해요',description:'필요한 기능과 예산을 적어 보면 선택이 조금 더 쉬워져요.',steps:['무엇을 사려는지 이야기해요.','꼭 필요한 조건과 예산을 정해요.','직접 비교할 수 있는 체크리스트를 만들어요.'],prompt:'물건을 사기 전에 비교 기준을 만들고 싶어. 내가 무엇을 찾는지 먼저 물어봐 줘. 실제 가격이나 재고를 확인했다고 말하지는 마.'},
 {id:'routine',icon:'heart',category:'건강',title:'작은 습관 하나를 만들어 볼까요?',description:'무리하지 않고 일상에서 이어 갈 수 있는 나만의 루틴을 계획해요.',steps:['바꾸고 싶은 일상 습관을 골라요.','하루에 쓸 수 있는 시간을 정해요.','가볍게 시작할 실천 목록을 만들어요.'],prompt:'매일 10분으로 시작할 수 있는 일상 습관을 같이 계획해 줘. 지금 내 생활을 먼저 물어봐 줘.'},
 {id:'care',icon:'people',category:'사람·반려동물',title:'함께하는 시간을 조금 더 다정하게',description:'가족, 친구, 반려동물과 나누고 싶은 일상 속 시간을 챙겨요.',steps:['누구와 어떤 시간을 보내고 싶은지 이야기해요.','서로의 일정과 취향을 생각해요.','이번 주에 해 볼 작은 일을 정해요.'],prompt:'소중한 사람이나 반려동물과 시간을 보내고 싶어. 누구와 어떤 시간을 보내려는지부터 물어봐 줘.'},
 {id:'writing',icon:'file',category:'일·서류',title:'빈 페이지 앞에서 막혔을 때',description:'주제와 독자부터 정하고, 부담 없는 첫 초안을 함께 만들어요.',steps:['글을 쓰는 목적과 독자를 정해요.','꼭 넣을 내용을 간단히 모아요.','첫 초안을 만들고 다듬어요.'],prompt:'글 초안을 만들고 싶어. 주제와 독자를 정할 수 있게 하나씩 질문해 줘.'},
 {id:'travel',icon:'compass',category:'여행',title:'떠나기 전에, 빠뜨린 것은 없나요?',description:'여행지와 일정에 맞는 준비물 목록을 함께 만들어요.',steps:['여행지와 기간을 이야기해요.','이동 방식과 계획을 정리해요.','짐과 출발 전 할 일을 목록으로 만들어요.'],prompt:'여행 준비물 목록을 만들고 싶어. 어디로 언제 가는지부터 물어봐 줘.'},
 {id:'home',icon:'home',category:'집',title:'우리 집에 맞는 정리 순서를 찾아요',description:'한 번에 다 하려고 애쓰지 말고, 작은 공간 하나부터 시작해요.',steps:['정리하고 싶은 공간을 골라요.','남길 것과 옮길 것을 나눠 생각해요.','짧은 시간 안에 할 순서를 정해요.'],prompt:'집을 조금씩 정리하고 싶어. 어느 공간부터 시작할지 질문해 주고 15분 안에 할 계획을 함께 세워 줘.'},
 {id:'reading',icon:'play',category:'즐길 거리',title:'다 읽은 책, 오래 기억하고 싶어요',description:'인상적인 문장과 떠오른 생각을 하나의 기록으로 남겨요.',steps:['책과 인상적인 장면을 이야기해요.','그 장면이 남은 이유를 생각해요.','나만의 짧은 감상 기록을 만들어요.'],prompt:'책을 읽고 기록을 남기려 해. 제목과 기억에 남는 내용을 정리할 질문을 해 줘.'}
];
export function Explore({onChoose}:{onChoose:(s:string)=>void}) {
 const [category,setCategory]=useState('전체'),[selected,setSelected]=useState<string|null>(null),[dismissed,setDismissed]=useState<string[]>([]),[undo,setUndo]=useState<string|null>(null);
 const offer=suggestions.find(s=>s.id===selected);
 const visible=suggestions.filter(s=>!dismissed.includes(s.id)&&(category==='전체'||s.category===category));
 useEffect(()=>{if(!undo)return;const timer=setTimeout(()=>setUndo(null),4000);return()=>clearTimeout(timer)},[undo]);
 function dismiss(id:string){setDismissed(ids=>[...ids,id]);setSelected(null);setUndo(id)}
 return <section className="panel explore-panel"><div className="page-heading"><h1>둘러보기</h1></div><div className="category-tabs">{['전체',...suggestions.map(s=>s.category)].map(c=><button key={c} aria-pressed={c===category} onClick={()=>setCategory(c)}>{c}</button>)}</div>
  <div className="suggestion-list">{visible.map(s=><div className="explore-offer-row" key={s.id} onContextMenu={e=>{e.preventDefault();setSelected(s.id)}}><button className="explore-offer-main" onClick={()=>setSelected(s.id)}><span className={`explore-offer-icon icon-${s.id}`}><Icon name={s.icon} size={25}/></span><span className="explore-offer-copy"><strong>{s.title}</strong><p>{s.description}</p><small>{s.category}</small></span></button><button className="icon-button explore-offer-dismiss" aria-label={`${s.title} 제안 메뉴`} onClick={()=>setSelected(s.id)}><Icon name="more" size={18}/></button></div>)}</div>
  {!visible.length&&<Empty icon="compass" title="지금은 제안이 없어요" body="다른 주제를 둘러보세요. 이 화면을 다시 열면 숨긴 제안을 다시 볼 수 있어요."/>}
  {offer&&<Modal title={offer.title} variant="sheet" onClose={()=>setSelected(null)}><div className="explore-detail"><span className={`explore-offer-icon icon-${offer.id}`}><Icon name={offer.icon} size={28}/></span><p>{offer.description}</p><h3>진행 순서</h3><ol className="explore-steps">{offer.steps.map((step,i)=><li key={step}><span>{i+1}</span><p>{step}</p></li>)}</ol><p className="context-note">시작하면 질문을 채팅 입력창에 담아요. 보내기 전에 수정할 수 있어요.</p></div><div className="form-actions"><button className="subtle-button danger" onClick={()=>dismiss(offer.id)}>이 제안 숨기기</button><button className="primary-button" onClick={()=>{setSelected(null);onChoose(offer.prompt)}}>시작</button></div></Modal>}
  {undo&&<div className="explore-undo" role="status"><span>제안을 숨겼어요.</span><button onClick={()=>{setDismissed(ids=>ids.filter(id=>id!==undo));setUndo(null)}}>되돌리기</button></div>}
 </section>;
}
