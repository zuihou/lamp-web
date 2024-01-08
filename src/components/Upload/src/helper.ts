export function checkFileType(file: File, accepts: string[]) {
  const newTypes = accepts.join('|');
  // const reg = /\.(jpg|jpeg|png|gif|txt|doc|docx|xls|xlsx|xml)$/i;
  const reg = new RegExp('\\.(' + newTypes + ')$', 'i');

  let flag = false;
  for (const accept of accepts) {
    if (!accept) {
      return false;
    }
    if (accept.startsWith('.')) {
      flag = new RegExp('(' + accept + ')$', 'i').test(file.name);
    } else if (accept.includes('/')) {
      flag = new RegExp('(' + accept + ')', 'i').test(file.type);
    } else {
      flag = reg.test(file.name);
    }
    if (flag) {
      return flag;
    }
  }
  return flag;
}

export function checkImgType(file: File) {
  return isImgTypeByName(file.name);
}

export function isImgTypeByName(name: string) {
  return /\.(jpg|jpeg|png|gif)$/i.test(name);
}

export function getBase64WithFile(file: File) {
  return new Promise<{
    result: string;
    file: File;
  }>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve({ result: reader.result as string, file });
    reader.onerror = (error) => reject(error);
  });
}
