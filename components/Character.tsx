'use client';
import {useId} from 'react';
export default function Character({color='#22cd56',large=false,thinking=false}:{color?:string;large?:boolean;thinking?:boolean}) {
 const id=useId().replaceAll(':','');
 return <svg className={`character ${large?'large':''} ${thinking?'thinking':''}`} viewBox="0 0 160 160" role="img" aria-label="젤리 피클 캐릭터">
   <defs><radialGradient id={id} cx="35%" cy="25%" r="80%"><stop stopColor="#f2fff0" stopOpacity=".8"/><stop offset=".3" stopColor={color}/><stop offset=".85" stopColor={color}/><stop offset="1" stopColor="#087e31"/></radialGradient><filter id={`${id}shadow`} x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="5"/></filter></defs>
   <ellipse cx="80" cy="142" rx="39" ry="5" fill="#174a20" opacity=".13" filter={`url(#${id}shadow)`}/>
   <g className="character-body"><path d="M80 28C53 9 21 26 28 56c3 12 3 25-3 43-11 35 18 52 46 37 6-3 12-3 18 0 29 15 57-5 45-37-6-16-8-27-3-42 8-30-24-47-51-29Z" fill={`url(#${id})`} stroke={color} strokeWidth="2"/>
   <path d="M42 38c7-8 18-7 24-3" fill="none" stroke="white" strokeWidth="5" opacity=".45" strokeLinecap="round"/>
   <g className="eyes"><ellipse cx="63" cy="78" rx="8" ry="14" fill="#16211a"/><ellipse cx="98" cy="78" rx="8" ry="14" fill="#16211a"/><ellipse cx="61" cy="72" rx="2.5" ry="4" fill="white"/><ellipse cx="96" cy="72" rx="2.5" ry="4" fill="white"/></g><path d="M75 99q5 4 10 0" fill="none" stroke="#17542c" strokeWidth="2.5" strokeLinecap="round" opacity=".6"/></g>
 </svg>;
}
