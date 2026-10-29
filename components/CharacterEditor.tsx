'use client';
import {useState} from 'react';
import {COLORS,type State} from '@/lib/state';
import type {Update} from './WorkspacePanels';
import Character from './Character';
import Icon from './Icon';
import Modal from './Modal';

export default function CharacterEditor({state,update,onClose}:{state:State;update:Update;onClose:()=>void}) {
  const [name,setName]=useState(state.name),[color,setColor]=useState(state.color),[error,setError]=useState('');
  return <Modal title="피클 꾸미기" onClose={onClose} variant="sheet"><form onSubmit={e=>{e.preventDefault();if(!name.trim())return;if(update(s=>({...s,name:name.trim(),color})))onClose();else setError('변경 내용을 저장하지 못했어요. 저장 공간을 확인한 뒤 다시 시도해 주세요.');}}>
    <div className="character-preview"><Character color={color} large/></div>
    <label>이름<input value={name} maxLength={40} required autoFocus onChange={e=>setName(e.target.value)}/></label>
    <fieldset className="character-colors"><legend>색상</legend><div className="swatches">{COLORS.map((c,i)=><button key={c} type="button" style={{background:c}} aria-label={['초록','파랑','보라','분홍','노랑','주황'][i]} aria-pressed={color===c} onClick={()=>setColor(c)}>{color===c&&<Icon name="check" size={18}/>}</button>)}</div></fieldset>
    {error&&<p className="error-text" role="alert">{error}</p>}
    <button className="primary-button full" disabled={!name.trim()}>저장</button>
  </form></Modal>;
}
