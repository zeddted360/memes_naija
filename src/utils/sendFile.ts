
export const sendFile = (files: (FileList | [] | undefined),formData:FormData) => {
    const fileArray = files as Array<File>;
    if (fileArray.length > 0) {
      for (let i = 0; i < fileArray.length; i++) {
        formData.append("files", fileArray[i]);
      }
    }
}