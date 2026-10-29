'use client';
import {useEffect,useRef} from 'react';
import Icon from './Icon';
export default function Modal({title,onClose,children,variant='dialog'}:{title:string;onClose:()=>void;children:React.ReactNode;variant?:'dialog'|'sheet'|'drawer'}) {
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const el=ref.current,previous=document.activeElement;el?.showModal();return()=>{el?.close();if(previous instanceof HTMLElement&&previous.isConnected)previous.focus()}},[]);
 return <dialog ref={ref} className={`modal modal-${variant}`} aria-label={title} onCancel={onClose} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose()}}}><div className="modal-inner">{variant==='sheet'&&<div className="sheet-handle"/>}<header><h2>{title}</h2><button className="icon-button" aria-label="닫기" onClick={onClose}><Icon name="close"/></button></header>{children}</div></dialog>;
}
