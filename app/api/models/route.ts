import { ChatError, localModels } from '../../../lib/chat';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    return Response.json({ models: await localModels(), available: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ models: [], available: false, error: error instanceof ChatError ? error.message : '모델 목록을 읽지 못했어요.' },
      { status: error instanceof ChatError ? error.status : 500 });
  }
}
