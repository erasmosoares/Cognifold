import { v4 as uuidv4 } from 'uuid';
import { AES, enc } from 'crypto-js';

export function formatNumber(number: number): string {
    if (number === null || number === undefined || isNaN(number)) {
      return "0.00";
    }
    
    return number.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      useGrouping: true,
    });
}

export const generateGuid = (): string => {
  return uuidv4();
};

export const encryptData = (data: any)  => {
  const encrypted = AES.encrypt(JSON.stringify(data), 'uC17T!8jbdMKR#a').toString();
  return encrypted;
};

export const decryptData = (encryptedData: any) => {
  const bytes = AES.decrypt(encryptedData, 'uC17T!8jbdMKR#a');
  const decrypted = bytes.toString(enc.Utf8);
  return JSON.parse(decrypted);;
};

export const isElectron = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf(' electron/') !== -1;
};

export const capitalizeFirstLetter = (word: string): string => {
  if (!word) return word; // Handle empty strings
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};
