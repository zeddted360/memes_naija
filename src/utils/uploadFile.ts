import { randomUUID } from "crypto";
import { writeFile } from "fs/promises";
import path from "path";

export const uploadFile = async (files: Array<File>, folder: string) => {
  const fileArr = await Promise.all(
    files.map(async (file: File) => {
    let  fileName = randomUUID() + "_" + Date.now() + "_" + file.name;
      const filePath = path.join(
        `public`,
        `/`,
        `${folder}`,
        `/`,
        `${fileName}`
      );
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filePath, buffer);
      return fileName;
    })
  );
  return fileArr;
};
