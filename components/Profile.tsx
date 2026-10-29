'use client';
import {useRef,useState} from 'react';
import {MAX_STATE_BYTES,downloadFile,parseState,type State} from '@/lib/state';
import type {Update} from './WorkspacePanels';
import Character from './Character';
import CharacterEditor from './CharacterEditor';
import Icon from './Icon';
import Modal from './Modal';

export default function Profile({state,update,onRestore,notify,onMemories,onTasks}:{state:State;update:Update;onRestore:(s:State)=>boolean;notify:(s:string)=>void;onMemories:()=>void;onTasks:()=>void}) {
  const [edit,setEdit]=useState(false),[connection,setConnection]=useState(false),[models,setModels]=useState<string[]>([]),[loading,setLoading]=useState(false),[modelError,setModelError]=useState(''),[restore,setRestore]=useState<State|null>(null);
  const importer=useRef<HTMLInputElement>(null);
  async function findModels(){setLoading(true);setModelError('');try{const r=await fetch('/api/models');const data=await r.json();if(!r.ok)throw new Error(data.error||'Ollama에 연결하지 못했어요.');setModels(data.models);if(!data.models.length)setModelError('설치된 모델이 없어요. Ollama에 모델을 설치해 주세요.')}catch(e){setModelError(e instanceof Error?e.message:'모델을 불러오지 못했어요.')}finally{setLoading(false)}}
  async function importBackup(file:File|undefined){if(!file)return;try{if(file.size>MAX_STATE_BYTES)throw new Error('백업 파일은 3 MB까지 가져올 수 있어요.');setRestore(parseState(JSON.parse(await file.text())))}catch(e){notify(e instanceof Error?e.message:'백업을 읽을 수 없어요.')}}

  return <section className="panel profile-panel">
    <div className="page-heading"><h1>나의 피클</h1></div>
    <button className="profile-identity" onClick={()=>setEdit(true)}><Character color={state.color}/><span><strong>{state.name}</strong><small>이름과 모습 바꾸기</small></span><Icon name="chevron" size={18}/></button>
    <div className="settings-card rows settings-connections"><button className="settings-row" onClick={()=>setConnection(true)}><Icon name="monitor"/><span>AI 연결<small>{state.mode==='demo'?'로컬 데모':state.model||'Ollama'}</small></span><Icon name="chevron" size={16}/></button></div>
    <h2 className="section-label">피클과 함께</h2>
    <div className="settings-card rows"><button className="settings-row" onClick={onMemories}><Icon name="bubble"/><span>함께한 추억</span><Icon name="chevron" size={16}/></button><button className="settings-row" onClick={onTasks}><Icon name="clock"/><span>예약한 작업</span><Icon name="chevron" size={16}/></button></div>
    <h2 className="section-label">설정</h2>
    <div className="settings-card rows"><div className="settings-row"><Icon name="sun"/><span>화면 및 디자인</span><select aria-label="화면 테마" value={state.theme} onChange={e=>update(s=>({...s,theme:e.target.value as State['theme']}))}><option value="light">라이트</option><option value="dark">다크</option><option value="system">시스템</option></select></div><button className="settings-row" onClick={()=>{downloadFile('pickle-backup.json',JSON.stringify(state),'application/json');notify('백업 파일을 내보냈어요.')}}><Icon name="download"/><span>내 데이터 내보내기</span><Icon name="chevron" size={16}/></button><button className="settings-row" onClick={()=>importer.current?.click()}><Icon name="archive"/><span>백업 가져오기</span><Icon name="chevron" size={16}/></button><input ref={importer} type="file" accept=".json" hidden onChange={e=>{void importBackup(e.target.files?.[0]);e.target.value=''}}/></div>
    <div className="privacy-note"><Icon name="check" size={16}/><p>대화와 추억은 이 기기에 저장돼요.<br/>자동 동기화하지 않으므로 데이터를 지우기 전에 백업해 주세요.</p></div><p className="version">Oh-My-Picklebot 0.1.0</p>
    {edit&&<CharacterEditor state={state} update={update} onClose={()=>setEdit(false)}/>}
    {connection&&<Modal title="AI 연결" onClose={()=>setConnection(false)} variant="sheet"><div className="connection-settings"><div className="setting-intro"><span className="setting-icon"><Icon name="monitor"/></span><div><strong>내 컴퓨터의 AI</strong><p>Ollama로 대화와 추억을 로컬 모델에 전달해요.</p></div><span className="tag">{state.mode==='demo'?'데모':'Ollama'}</span></div><div className="segmented"><button aria-pressed={state.mode==='demo'} onClick={()=>update(s=>({...s,mode:'demo'}))}>로컬 데모</button><button aria-pressed={state.mode==='ollama'} onClick={()=>{if(!state.model.trim()){setModelError('먼저 아래에서 모델 이름을 입력해 주세요.');void findModels()}else update(s=>({...s,mode:'ollama'}))}}>Ollama</button></div><div className="model-input"><input aria-label="Ollama 모델 이름" list="pickle-models" value={state.model} maxLength={120} onChange={e=>update(s=>({...s,model:e.target.value,mode:e.target.value.trim()?s.mode:'demo'}))} placeholder="모델 이름 (예: qwen3:8b)"/><datalist id="pickle-models">{models.map(m=><option key={m} value={m}/>)}</datalist><button className="subtle-button" disabled={loading} onClick={findModels}>{loading?'확인 중…':'모델 찾기'}</button></div>{modelError&&<p className="error-text" role="status">{modelError}</p>}<p className="setting-footnote">{state.mode==='demo'?'데모는 정해진 예시로 답해요. 실제 AI 대화는 Ollama를 연결해 주세요.':'Ollama가 실행 중이어야 해요. 연결 실패 시 오류를 알려드려요.'}</p></div></Modal>}
    {restore&&<Modal title="백업 가져오기" onClose={()=>setRestore(null)}><p>대화 {restore.conversations.length}개, 추억 {restore.memories.length}개, 문서 {restore.notes.length}개, 이미지 {restore.media?.length??0}개가 있어요. 현재 데이터를 먼저 내보낸 뒤 백업으로 바꿉니다.</p><div className="form-actions"><button className="subtle-button" onClick={()=>setRestore(null)}>취소</button><button className="primary-button" onClick={()=>{if(onRestore(restore)){setRestore(null);notify('백업을 가져왔어요.')}}}>현재 데이터 백업 후 복원</button></div></Modal>}
  </section>;
}
