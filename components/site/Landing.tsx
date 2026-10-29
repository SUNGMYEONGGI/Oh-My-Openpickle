'use client';

import {useState} from 'react';
import Link from 'next/link';
import Character from '../Character';
import Icon from '../Icon';
import s from './landing.module.css';

const repository = 'https://github.com/SUNGMYEONGGI/Oh-My-Openpickle';
const previews = [{id:'chat',label:'채팅',icon:'chat'}, {id:'memory',label:'함께한 추억',icon:'bubble'}, {id:'schedule',label:'예약',icon:'clock'}] as const;
const platforms = {
  mac: {label:'macOS',command:'npm run dist:mac',note:'Apple silicon에서 빌드와 실행을 확인했습니다. 서명·공증하지 않은 개발용 앱입니다.'},
  windows: {label:'Windows',command:'npm run dist:win',note:'Windows에서 빌드하세요. NSIS 설치 파일 설정을 제공하며 실제 실행은 아직 확인하지 않았습니다.'},
  linux: {label:'Linux',command:'npm run dist:linux',note:'Linux에서 빌드하세요. AppImage 설정을 제공하며 실제 실행은 아직 확인하지 않았습니다.'},
} as const;
const questions = [
  ['원본 Pickle과 어떤 관계인가요?', 'Oh-My-Picklebot은 원본 Pickle의 화면과 사용 흐름을 참고해 별도로 만든 프로젝트입니다. 원본 서비스와 제휴하거나 원본 계정·서버에 연결하지 않습니다.'],
  ['바로 AI와 대화할 수 있나요?', '처음에는 기능을 둘러볼 수 있는 데모 모드로 시작합니다. 실제 AI 대화는 같은 컴퓨터에 Ollama와 모델을 설치한 뒤, 나의 피클에서 연결하세요. 데모 답변과 모델 답변을 구분해서 표시합니다.'],
  ['대화와 기억은 어디에 저장되나요?', '사용하는 브라우저 또는 데스크톱 앱의 로컬 저장소에 보관합니다. 웹과 데스크톱 사이에 자동으로 동기화하지 않으며 JSON 백업으로 옮길 수 있습니다. 저장소를 지우기 전에 백업하세요.'],
  ['앱을 닫아도 예약한 일을 하나요?', '현재 예약은 앱이 열려 있는 동안 채팅으로 알려 주는 알림입니다. 앱을 닫았을 때 자동으로 일을 실행하거나 외부 서비스에 메시지를 보내지는 않습니다.'],
  ['어떤 컴퓨터에서 사용할 수 있나요?', '웹은 최신 브라우저에서 사용할 수 있습니다. 데스크톱은 Electron으로 함께 개발하고 있으며 macOS Apple silicon에서 확인했습니다. Windows와 Linux는 빌드 설정을 제공하고 실제 기기 검증은 남아 있습니다.'],
];

export default function Landing() {
  const [preview,setPreview]=useState<(typeof previews)[number]['id']>('chat');
  const [color,setColor]=useState(0);
  const [scheduled,setScheduled]=useState(true);
  const [platform,setPlatform]=useState<keyof typeof platforms>('mac');
  const [copyState,setCopyState]=useState('');
  const colors=['#22cd56','#68b4ed','#b296e6'];
  const install=`git clone ${repository}.git\ncd Oh-My-Openpickle\nnpm ci\n${platforms[platform].command}`;
  async function copyInstall() {
    try { await navigator.clipboard.writeText(install); setCopyState('설치 명령을 복사했어요.'); }
    catch { setCopyState('자동 복사를 사용할 수 없어요. 아래 명령을 선택해서 복사하세요.'); }
  }

  return <div className={s.site}>
    <a className={s.skip} href="#main">본문으로 건너뛰기</a>
    <header className={s.header}>
      <Link href="/" className={s.brand} aria-label="Oh-My-Picklebot 홈"><span className={s.brandCharacter}><Character/></span><span>Oh-My-Picklebot</span></Link>
      <nav aria-label="소개 페이지 메뉴" className={s.nav}><a href="#features">기능</a><a href="#start">시작하기</a><a href="#questions">자주 묻는 질문</a><a href={repository} target="_blank" rel="noreferrer">GitHub</a></nav>
      <Link href="/app" className={s.headerCta}>웹 앱 열기</Link>
    </header>

    <main id="main">
      <section className={s.hero} aria-labelledby="hero-title">
        <button className={s.heroCharacter} onClick={()=>setColor((color+1)%colors.length)} aria-label="피클 캐릭터 색 바꾸기" title="눌러서 색을 바꿔 보세요"><Character color={colors[color]} large/></button>
        <h1 id="hero-title">내 하루를 기억하는,<br/>나만의 피클.</h1>
        <p className={s.heroCopy}>생각을 나누고, 좋아하는 것을 기억하고, 하루를 정리하세요.<br className={s.desktopBreak}/> 웹에서도 데스크톱에서도, 당신 곁의 Oh-My-Picklebot.</p>
        <div className={s.actions}><Link className={s.primary} href="/app">웹에서 시작하기 <Icon name="chevron" size={16}/></Link><a className={s.secondary} href="#start"><Icon name="monitor" size={18}/> 데스크톱 설치</a></div>
        <p className={s.heroNote}>데모로 먼저 둘러보고, 원하는 로컬 AI를 연결하세요.</p>

        <div className={s.previewFrame} id="preview" aria-label="Oh-My-Picklebot 인터랙티브 예시">
          <div className={s.windowBar}><span aria-hidden="true" className={s.windowDots}><i/><i/><i/></span><span>Oh-My-Picklebot</span><span className={s.previewLabel}>예시 미리보기</span></div>
          <div className={s.previewApp}>
            <aside className={s.previewSidebar}><div className={s.previewBrand}><Character color={colors[color]}/><strong>나의 피클</strong></div><div className={s.previewNav}>{previews.map(item=><button key={item.id} onClick={()=>setPreview(item.id)} aria-pressed={preview===item.id}><Icon name={item.icon} size={20}/>{item.label}</button>)}</div><p>작은 순간도<br/>함께 기억해요.</p><span className={s.previewLocal}><span/> 이 기기에 보관</span></aside>
            <div className={s.previewContent}>
              <div className={s.previewHeader}><Character color={colors[color]}/><strong>피클</strong><span>{preview==='chat'?'오늘의 대화':preview==='memory'?'함께한 추억':'미리 예약한 일'}</span></div>
              <div className={s.mobilePreviewNav}>{previews.map(item=><button key={item.id} onClick={()=>setPreview(item.id)} aria-pressed={preview===item.id}>{item.label}</button>)}</div>
              <div className={s.previewBody} aria-live="polite">
                {preview==='chat' && <div className={s.demoChat}><time>오늘</time><p className={s.userBubble}>이번 주에는 매일 책을 조금씩 읽고 싶어.</p><p className={s.botBubble}>좋아. 처음부터 많이 읽으려고 하지 않아도 돼.<br/>하루 20분씩, 어떤 책으로 시작해 볼까?</p><p className={s.userBubble}>잠들기 전에 에세이 읽는 게 좋겠어.</p><p className={s.botBubble}>네가 좋아하는 시간이구나.<br/>잊고 싶지 않은 이야기는 추억으로 남겨 두자.</p><div className={s.demoComposer}>피클에게 하고 싶은 이야기 <span><Icon name="arrow" size={18}/></span></div></div>}
                {preview==='memory' && <div className={s.demoMemories}><h3>기억해 두고 싶은 이야기</h3><p>필요할 때 다시 꺼내 볼 수 있도록.</p><article><Icon name="bubble"/><div><p>잠들기 전에 에세이 읽는 시간을 좋아해요.</p><time>오늘 저장한 추억</time></div></article><article><Icon name="bubble"/><div><p>복잡한 이야기보다 짧고 명확한 설명을 좋아해요.</p><time>어제 저장한 추억</time></div></article><span>앱에서는 추억을 직접 추가하고 수정할 수 있어요.</span></div>}
                {preview==='schedule' && <div className={s.demoSchedule}><h3>작은 약속을 잊지 않게</h3><p>앱이 열려 있을 때 채팅으로 알려 드려요.</p><article><span className={s.scheduleClock}><Icon name="clock" size={28}/></span><div><strong>책 읽는 시간</strong><span>매일 오후 10:00</span></div><button role="switch" aria-checked={scheduled} aria-label="책 읽는 시간 예시 알림" className={s.switch} onClick={()=>setScheduled(!scheduled)}><span/></button></article><p className={s.scheduleState}>{scheduled?'예약 알림이 켜져 있어요.':'예약 알림을 잠시 쉬고 있어요.'}</p><div className={s.scheduleExample}><Icon name="chat" size={18}/><span>“오늘도 20분, 책과 함께할 시간이야.”</span></div></div>}
              </div>
              <div className={s.previewBottom}><span><Icon name="chat" size={18}/> 채팅</span><span><Icon name="compass" size={18}/> 둘러보기</span><span><Icon name="archive" size={18}/> 보관함</span><span><Icon name="user" size={18}/> 나의 피클</span></div>
            </div>
          </div>
        </div>
        <p className={s.previewCaption}>메뉴를 눌러 채팅·추억·예약 화면을 둘러보세요. 위 내용은 저장되지 않는 예시입니다.</p>
      </section>

      <section className={s.features} id="features" aria-labelledby="features-title">
        <div className={s.sectionHeading}><h2 id="features-title">말을 건네는 순간부터,<br/>조금 더 가까이.</h2><p>하나의 대화에서 시작해<br/>당신만의 기억과 기록으로 이어집니다.</p></div>
        <div className={s.featureRow}>
          <article><span className={s.featureIcon}><Icon name="chat" size={27}/></span><h3>편하게 이야기하세요</h3><p>대화를 나누고, 주제마다 새 대화를 시작하세요. 전에 나눈 이야기는 검색으로 다시 찾을 수 있어요.</p></article>
          <article><span className={s.featureIcon}><Icon name="bubble" size={27}/></span><h3>기억할 것을 골라 주세요</h3><p>좋아하는 것, 중요한 사실, 다시 보고 싶은 말. 직접 고른 추억을 다음 대화에도 함께 전달해요.</p></article>
          <article><span className={s.featureIcon}><Icon name="archive" size={27}/></span><h3>기록을 한곳에 모으세요</h3><p>메모를 쓰고 문서를 보관하세요. 텍스트와 Markdown으로 가져오고, 필요할 때 파일로 꺼낼 수 있어요.</p></article>
        </div>
        <div className={s.personalStrip}><div className={s.characterGroup}>{colors.map(c=><Character key={c} color={c}/>)}</div><div><h3>이름도, 색도, 당신답게.</h3><p>피클에게 이름을 지어 주고 좋아하는 색을 골라 보세요.<br/>밝은 화면과 어두운 화면도 자유롭게 바꿀 수 있어요.</p></div><Link href="/app" className={s.textLink}>나의 피클 만나기 <Icon name="chevron" size={16}/></Link></div>
      </section>

      <section className={s.localSection} aria-labelledby="local-title"><div className={s.localInner}><div><span className={s.localIllustration} aria-hidden="true"><Icon name="monitor" size={82}/><span><Character/></span></span><h2 id="local-title">나의 이야기니까,<br/>내 기기에.</h2><p>대화와 문서는 사용하는 브라우저와 앱에 보관합니다. 다음 대화에 남길 기억도 직접 고릅니다.</p></div><dl><div><dt>보관은 가까이</dt><dd>대화·기억·설정을 로컬에 저장합니다. 클라우드 동기화 없이, 백업 파일로 다른 환경에 옮길 수 있어요.</dd></div><div><dt>AI 연결은 원하는 때에</dt><dd>데모로 화면을 살펴본 뒤, 같은 컴퓨터의 Ollama 모델을 연결해 실제 대화를 시작하세요.</dd></div><div><dt>기억은 내 손으로</dt><dd>피클이 참고할 추억을 직접 추가하고 수정하세요. 브라우저 데이터를 지우기 전에는 백업을 남겨 주세요.</dd></div></dl></div></section>

      <section className={s.start} id="start" aria-labelledby="start-title"><div className={s.sectionHeading}><h2 id="start-title">어디서 만날까요?</h2><p>가볍게 웹으로 시작하거나,<br/>내 컴퓨터에 앱으로 곁에 두세요.</p></div><div className={s.startGrid}><article className={s.webStart}><Icon name="compass" size={34}/><h3>브라우저에서 바로</h3><p>설정 없이 데모를 둘러보세요.<br/>대화와 설정은 이 브라우저에 저장됩니다.</p><Link href="/app" className={s.primary}>웹 앱 열기 <Icon name="chevron" size={16}/></Link><small>실제 AI 대화에는 로컬 Ollama 연결이 필요합니다.</small></article><article className={s.desktopStart}><h3>데스크톱에서 함께</h3><p>Node.js 22.18 이상과 저장소 접근 권한이 필요합니다.</p><div className={s.platformTabs} aria-label="데스크톱 설치 대상">{Object.entries(platforms).map(([key,value])=><button key={key} aria-pressed={platform===key} onClick={()=>{setPlatform(key as keyof typeof platforms);setCopyState('');}}>{value.label}</button>)}</div><div className={s.commandHeader}><span>터미널에서 실행</span><button onClick={copyInstall} aria-label={`${platforms[platform].label} 설치 명령 복사`}><Icon name="file" size={14}/> 복사</button></div><pre><code>{install}</code></pre><p className={s.platformNote}>{platforms[platform].note}</p><p className={s.copyStatus} role="status">{copyState}</p></article></div></section>

      <section className={s.faq} id="questions" aria-labelledby="questions-title"><h2 id="questions-title">궁금한 이야기</h2><div>{questions.map(([question,answer])=><details key={question}><summary>{question}<Icon name="plus" size={19}/></summary><p>{answer}</p></details>)}</div></section>
      <section className={s.lastCta}><Character color={colors[color]}/><h2>오늘의 첫 이야기를 들려주세요.</h2><Link href="/app" className={s.primary}>피클 만나러 가기 <Icon name="chevron" size={16}/></Link></section>
    </main>
    <footer className={s.footer}><span>Oh-My-Picklebot</span><p>웹과 데스크톱에서 함께하는 나만의 피클.</p><a href={repository} target="_blank" rel="noreferrer">GitHub 저장소</a><a href={`${repository}/blob/main/README.md`} target="_blank" rel="noreferrer">실행 안내</a></footer>
  </div>;
}
