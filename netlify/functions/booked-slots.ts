import { fetchBookedSlotsResult } from '../../server/bookingService';

function jsonResponse(body: unknown, status: number, extraHeaders?: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      ...extraHeaders,
    },
  });
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'GET') {
    return jsonResponse({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  }

  const result = await fetchBookedSlotsResult();
  return jsonResponse(result.body, result.status);
}
