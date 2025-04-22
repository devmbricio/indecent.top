import stream from "getstream";

const client = stream.connect(
  process.env.NEXT_PUBLIC_STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!,
  process.env.STREAM_APP_ID!
);

export default client;
