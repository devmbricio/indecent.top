// pages/api/stream-token.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { StreamClient } from '@stream-io/node-sdk';
import { env } from '@/env.mjs';

const STREAM_API_KEY = env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = env.STREAM_SECRET_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  if (!STREAM_API_KEY || !STREAM_API_SECRET) {
    return res.status(500).json({ message: 'Stream API key or secret is missing' });
  }

  const streamClient = new StreamClient(STREAM_API_KEY, STREAM_API_SECRET);
  const expirationTime = Math.floor(Date.now() / 1000) + 3600;
  const issuedAt = Math.floor(Date.now() / 1000) - 60;
  const token = streamClient.createToken(userId, expirationTime, issuedAt);

  return res.status(200).json({ token });
}
