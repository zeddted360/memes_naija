import { writeFile } from "fs/promises";
import path from "path";

export const upLoadProfilePic = async (file: File) => {
  const filePath = path.join("public", "/profile_pic", `${file.name}`);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  await writeFile(filePath, buffer);
  return file.name;
};
