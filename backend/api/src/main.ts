import Fastify from "fastify";
import { randomUUID } from "node:crypto";
import qs from "qs";

const fastify = Fastify({
  logger: true,
});

type Sala = {
  nome: string;
  capacidade: number;
  local: string;
  descricao: string;
};

const db: Record<string, Sala> = {};

fastify.get("/room", () => db);
fastify.delete("/room/:id", ({ params }, reply) => {
  if (typeof params === "object" && params !== null && "id" in params) {
    delete db[(params as { id: string }).id];
    reply.send({ message: "OK" });
  } else {
    reply.status(404).send({ message: "Sala não encontrada." });
  }
});
fastify.post("/room", ({ body }, reply) => {
  if (
    typeof body === "object" &&
    body !== null &&
    "nome" in body &&
    typeof body.nome === "string" &&
    "capacidade" in body &&
    typeof body.capacidade === "number" &&
    "local" in body &&
    typeof body.local === "string" &&
    "descricao" in body &&
    typeof body.descricao === "string"
  ) {
    const id = randomUUID();
    db[id] = body as Sala;
    reply.status(201).send({ message: "OK", id });
  } else {
    reply.status(400).send({ message: "Sala mal formada" });
  }
});

fastify.put("/room/:id", ({ body, params }, reply) => {
  if (
    typeof body === "object" &&
    body !== null &&
    "nome" in body &&
    typeof body.nome === "string" &&
    "capacidade" in body &&
    typeof body.capacidade === "number" &&
    "local" in body &&
    typeof body.local === "string" &&
    "descricao" in body &&
    typeof body.descricao === "string" &&
    typeof params === "object" &&
    params !== null &&
    "id" in params &&
    typeof params.id === "string" &&
    params.id in db
  ) {
    db[(params as { id: string }).id] = body as Sala;
    reply.send({ message: "OK" });
  } else {
    reply.status(400).send({ message: "Alteração mal formada" });
  }
});

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
