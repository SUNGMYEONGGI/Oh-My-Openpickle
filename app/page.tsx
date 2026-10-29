import type {Metadata} from 'next';
import Landing from '@/components/site/Landing';

export const metadata: Metadata = {
  title: 'Oh-My-Picklebot · 내 하루를 기억하는 나만의 피클',
  description: '대화하고, 기억하고, 기록하세요. 웹과 데스크톱에서 함께하는 나만의 피클. 데모로 시작하고 로컬 Ollama를 연결할 수 있습니다.',
};

export default function Page() { return <Landing/>; }
