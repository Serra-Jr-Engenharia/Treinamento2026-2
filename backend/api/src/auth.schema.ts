import { z } from 'zod';

export interface UsuarioSemSenha {
  id: string;
  nome: string;
  email: string;
  criadoEm: Date;
}

export const registerSchema = z.object({
  nome: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres').max(80, 'O nome deve ter no máximo 80 caracteres'),
  email: z.string().email('Informe um e-mail válido'),
  senha: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres').max(100, 'A senha deve ter no máximo 100 caracteres'),
});

export const loginSchema = z.object({
  email: z.string().email('Informe um e-mail válido'),
  senha: z.string().min(1, 'A senha é obrigatória'),
});

export const updatePasswordSchema = z
  .object({
    senhaAtual: z.string().min(1, 'A senha atual é obrigatória'),
    novaSenha: z.string().min(6, 'A nova senha deve ter no mínimo 6 caracteres').max(100, 'A nova senha deve ter no máximo 100 caracteres'),
  })
  .refine((data) => data.senhaAtual !== data.novaSenha, {
    message: 'A nova senha deve ser diferente da senha atual',
    path: ['novaSenha'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdatePasswordInput = z.infer<typeof updatePasswordSchema>;