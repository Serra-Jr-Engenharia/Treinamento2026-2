import { compare, hash } from "bcryptjs";

export const hashPass = (pass: string) => hash(pass, 10);
export const verify = (pass: string, hash: string) => compare(pass, hash);
