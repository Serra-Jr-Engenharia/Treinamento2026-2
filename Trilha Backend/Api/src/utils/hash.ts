import { compare, hash } from "bcryptjs";




export async function hashpassword(senha:string): Promise<string> {
    return hash(senha, 10);
}

export async function  verifyPassword(senha:string, hash:string): Promise<boolean> {
    return  compare( senha, hash );
}


