import * as bcrypt from 'bcrypt';

export const hashString = async (string: string) => {
  const salt = await bcrypt.genSalt(11);
  return bcrypt.hash(string, salt);
};

export const compareStringToHash = async (string: string, hash: string) => {
  return await bcrypt.compare(string, hash);
};
