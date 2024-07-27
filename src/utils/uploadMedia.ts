'use server';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebaseConfig';
import { v4 } from 'uuid';

export const uploadMedia = async (
  selectedFiles: FileList,
  mediaUrls?: string[],
  _id?: string
) => {
  for (let i = 0; i < selectedFiles.length; i++) {
    const file = selectedFiles[i];
    const fileName = `${Date.now()}-${v4()}-${file.name}`;
    const storageRef = ref(storage, `/uploads/${fileName}`);
    const mediaRef = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    mediaUrls?.push(downloadURL);
  }
  const updateResponse = await fetch(`/api/post/update/${_id}`, {
    method: 'POST',
    body: JSON.stringify({ media: mediaUrls }),
  });
  if (!updateResponse.ok) {
    throw new Error('Failed to update media');
  }
};
