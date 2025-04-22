import { NextApiRequest, NextApiResponse } from "next";
import client from "@/lib/stream";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { userId, videoUrl } = req.body;

    try {
      const userFeed = client.feed("user", userId);

      await userFeed.addActivity({
        actor: userId,
        verb: "stream",
        object: videoUrl,
        time: new Date().toISOString(),
      });

      res.status(200).json({ message: "Atividade adicionada ao GetStream" });
    } catch (error) {
      console.error("Erro ao adicionar atividade:", error);
      res.status(500).json({ error: "Erro ao adicionar atividade ao GetStream" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
