export type Sala = {
  nome: string;
  capacidade: number;
  local: string;
  descricao: string;
};

export const SalaTypes = {
  nome: "string",
  capacidade: "number",
  local: "string",
  descricao: "string",
} as const;

export const isSala = (obj: unknown): obj is Sala => {
  if (typeof obj !== "object" || obj === null) return false;
  for (const [prop, ty] of Object.entries(SalaTypes) as [
    keyof typeof SalaTypes,
    (typeof SalaTypes)[keyof typeof SalaTypes],
  ][]) {
    //@ts-ignore Por algum motivo, o typescript language server não entende que a expressão 1 indica que prop é chave em obj.
    if (!(prop in obj) || typeof obj[prop] !== ty) return false;
  }
  return true;
};

export const isPartialSala = (obj: unknown): obj is Partial<Sala> => {
  if (typeof obj !== "object" || obj === null) return false;
  for (const [prop, ty] of Object.entries(SalaTypes) as [
    keyof typeof SalaTypes,
    (typeof SalaTypes)[keyof typeof SalaTypes],
  ][]) {
    //@ts-ignore Por algum motivo, o typescript language server não entende que a expressão 1 indica que prop é chave em obj.
    if (prop in obj && typeof obj[prop] !== ty) return false;
  }
  return true;
};

export const identifies = (obj: unknown): obj is { id: string } =>
  typeof obj === "object" &&
  obj !== null &&
  "id" in obj &&
  typeof obj.id === "string";
