import { exec } from "child_process";

export async function generateThumbnail(videoPath: string, thumbnailPath: string) {
  return new Promise((resolve, reject) => {
    const command = `ffmpeg -i ${videoPath} -ss 00:00:01.000 -vframes 1 ${thumbnailPath}`;
    exec(command, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve(thumbnailPath);
      }
    });
  });
}
