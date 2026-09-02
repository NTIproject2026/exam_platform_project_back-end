import { UserModel } from "./model.js";

export function findUserByEmail(email: string) {
  return UserModel.findOne({ email });
}

export function findUserById(id: string) {
  return UserModel.findById(id);
}

export function createUser(data: {
  name: string;
  email: string;
  password: string;
  role?: string;
}) {
  return UserModel.create(data);
}

export function updateUser(id: string, data: { name?: string; email?: string }) {
  return UserModel.findByIdAndUpdate(id, data, { new: true });
}

export function setResetCode(email: string, code: string, expires: Date) {
  return UserModel.findOneAndUpdate(
    { email },
    { resetCode: code, resetCodeExpires: expires },
    { new: true },
  );
}

export function findByResetCode(email: string, code: string) {
  return UserModel.findOne({ email, resetCode: code, resetCodeExpires: { $gt: new Date() } });
}

export function updatePasswordAndClearCode(id: string, hashedPassword: string) {
  return UserModel.findByIdAndUpdate(id, {
    password: hashedPassword,
    resetCode: undefined,
    resetCodeExpires: undefined,
  });
}