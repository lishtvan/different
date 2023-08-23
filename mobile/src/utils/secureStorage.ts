import EncryptedStorage from 'react-native-encrypted-storage';

export const saveSession = (token: string, userId: number) =>
  EncryptedStorage.setItem('session', JSON.stringify({ token, userId }));
export const getSession = () => EncryptedStorage.getItem('session');
export const destroySession = () => EncryptedStorage.removeItem('session');
