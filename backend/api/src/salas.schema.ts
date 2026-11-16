import { z } from 'zod';

export interface Salas {
  id?: string;
  nome: string;
  capacidade: number;
  local: string;
  descricao: string;
}

export const roomSchema = z.object({
  nome: z.string().min(5, "O nome deve ter no mínimo 5 caracteres").max(20, "O nome deve ter no máximo 20 caracteres"),
  capacidade: z.number().int("A capacidade deve ser um número inteiro").min(2, "A capacidade mínima é de 2 pessoas").max(100, "A capacidade máxima é de 100 pessoas"),
  local: z.string().min(3, "O local deve ter no mínimo 3 caracteres").max(50, "O local deve ter no máximo 50 caracteres"),
  descricao: z.string().min(5, "A descrição deve ter no mínimo 5 caracteres").max(200, "A descrição deve ter no máximo 200 caracteres")
});

export const idParamSchema = z.object({
  id: z.string().uuid("O ID fornecido não é um UUID válido")
});