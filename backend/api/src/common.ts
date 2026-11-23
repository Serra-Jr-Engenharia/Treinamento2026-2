import z from "zod";

type PartialAndUndefinable<R> = {
  [K in keyof R]?: R[K] | undefined;
};

export const withFallback = <R extends Record<keyof any, any>>(
  priority: PartialAndUndefinable<R>,
  fallback: R,
): R => {
  for (const key in fallback) priority[key] ||= fallback[key];
  return priority as R; // Isso é seguro, a partir do momento que definimos todas chaves ausentes em priority com chaves respectives em fallback.
};

export const SalaSchema = z.object({
  nome: z.string().min(5).max(20),
  descricao: z.string(),
  capacidade: z.number().min(2).max(100),
  local: z.string(),
});

export const IdSchema = z.object({
  id: z.uuid(),
});

export const UserSchema = z.object({
  nome: z.string(),
  email: z.string(),
  senha: z.string().min(8, "Senhas precisam de no mínimo 8 caractéres"),
});
