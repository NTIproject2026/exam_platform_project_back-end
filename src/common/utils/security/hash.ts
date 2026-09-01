import bcrypt from "bcrypt";

export function GlobalHash(plainText: string): string {
  return bcrypt.hashSync(plainText, 8);
}

export function GlobalCompareHash(
  plainText: string,
  hashText: string,
): boolean {
  return bcrypt.compareSync(plainText, hashText);
}
