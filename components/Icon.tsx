export type IconName='chat'|'compass'|'archive'|'user'|'menu'|'plus'|'arrow'|'mic'|'close'|'chevron'|'clock'|'bubble'|'sun'|'settings'|'download'|'search'|'check'|'file'|'trash'|'pause'|'play'|'volume'|'back'|'edit'|'monitor'|'image'|'more'|'wallet'|'bag'|'heart'|'people'|'home'|'tasks'|'world'|'copy'|'reply'|'spectrum'|'share';
const paths:Partial<Record<IconName,React.ReactNode>>={
 image:<><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r="1.5"/><path d="m4 17 5-5 4 4 3-3 5 5"/></>,
 wallet:<><rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 8V6l14-3v2m4 6h-6v5h6"/></>,
 bag:<><path d="M4 7h16l-1 14H5L4 7Z M8 8V6a4 4 0 0 1 8 0v2"/></>,
 heart:<path d="M12 20S3 14 3 8.5C3 3 10 2 12 7c2-5 9-4 9 1.5C21 14 12 20 12 20Z"/>,
 home:<><path d="m3 10 9-7 9 7v11h-7v-7h-4v7H3V10Z"/></>,
 spectrum:<path d="M4 10v4m4-7v10m4-14v18m4-14v10m4-7v4"/>,
 chat:<path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7A8.4 8.4 0 0 1 4 11.5a8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z"/>,
 compass:<><circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6 6-2Z"/></>,
 archive:<><path d="m3 9 3-6h12l3 6v10H3V9Z M3 9h18 M9 14h6"/></>,
 user:<><circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 6 0 0 1 16 0v2H4Z"/></>,
 menu:<path d="M5 8h14M5 15h14"/>,plus:<path d="M12 4v16M4 12h16"/>,arrow:<path d="M12 20V4m-6 6 6-6 6 6"/>,
 mic:<><rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3"/></>,
 close:<path d="m6 6 12 12M6 18 18 6"/>,chevron:<path d="m9 5 7 7-7 7"/>,
 clock:<><circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/></>,
 bubble:<><circle cx="9" cy="10" r="6"/><circle cx="17" cy="17" r="4"/></>,
 sun:<><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/></>,
 settings:<><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3"/><circle cx="15" cy="17" r="3"/></>,
 download:<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>,
 search:<><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></>,
 check:<path d="m5 12 4 4L19 6"/>,file:<><path d="M14 2H5v20h14V7l-5-5Zm0 0v5h5M8 12h8M8 16h6"/></>,
 trash:<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7m4-7v7"/>,
 pause:<path d="M8 5v14M16 5v14"/>,play:<path d="m8 4 12 8-12 8V4Z"/>,
 volume:<><path d="m11 4-6 5H2v6h3l6 5V4Z M16 8a6 6 0 0 1 0 8 M19 5a10 10 0 0 1 0 14"/></>,
 back:<path d="m14 5-7 7 7 7"/>,edit:<path d="m4 16 12-12 4 4L8 20H4v-4ZM13 7l4 4"/>,
 monitor:<><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5M8 21h8"/></>,
 tasks:<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>,
 more:<path d="M12 5h.01M12 12h.01M12 19h.01"/>,
 copy:<><rect x="8" y="8" width="13" height="13" rx="3"/><path d="M16 8V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v7a3 3 0 0 0 3 3h2"/></>,
 reply:<path d="M10 5 4 11l6 6M4 11h10a6 6 0 0 1 6 6v2"/>,
 share:<path d="M12 15V3m-4 4 4-4 4 4M5 11v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8"/>,
 people:<><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5.5 5.5 0 0 1 3.5 6"/></>,
 world:<><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.3 3 14.7 0 18M12 3c-3 3.3-3 14.7 0 18"/></>
};
// Own drawings; selected tab icons switch to a filled, heavier variant.
const fillable:IconName[]=['chat','user'];
export default function Icon({name,size=22,selected=false}:{name:IconName;size?:number;selected?:boolean}) {
 return <svg width={size} height={size} viewBox="0 0 24 24" fill={selected&&fillable.includes(name)?'currentColor':'none'} stroke="currentColor" strokeWidth={selected?2.4:1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
