import bcrypt from "bcrypt";

export const GenerateSalt = async () => {
  const salt = await bcrypt.genSaltSync(10);
  return salt;
};

export const GeneratePassword = async (password: any, salt: any) => {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
