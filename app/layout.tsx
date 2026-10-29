import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'Oh-My-Picklebot · 나만의 피클', description: '내 컴퓨터에서 함께하는 작은 AI 친구' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ko"><body>{children}</body></html>; }
