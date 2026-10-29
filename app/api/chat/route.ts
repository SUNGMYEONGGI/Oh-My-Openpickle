import { ChatError, chatReply, checkChatRequest, parseChatInput, readJson } from '../../../lib/chat';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    checkChatRequest(request);
    const input = parseChatInput(await readJson(request));
    return Response.json(await chatReply(input, fetch, request.signal), { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    return Response.json({ error: error instanceof ChatError ? error.message : '대화를 처리하지 못했어요. 다시 시도해 주세요.' },
      { status: error instanceof ChatError ? error.status : 500 });
  }
}
