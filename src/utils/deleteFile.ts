import { existsSync } from "fs";
import { unlink } from "fs/promises";
import path from "path";

export const deleteFile = async (filePaths: Array<string>, folder: string) => {
  await Promise.all(
    filePaths.map(async (file: string) => {
      const filePath = path.join(folder, file);
      if (typeof file === null) {
        console.log("file is null");
        return;
          }
      if (existsSync(filePath)) {
        const deletedFile = await unlink(filePath);
        console.log("files deleted");
        return deletedFile;
      } else {
        console.log("no files to delete");
        return;
      }
    })
  );
};
