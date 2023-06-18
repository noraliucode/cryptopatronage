import type { VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.query.key !== "sharedKey") {
    response.status(404).end();
    return;
  }

  response.status(200).json({ success: true });
}

export {};
