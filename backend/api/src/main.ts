import Fastify from "fastify";
import db from "./prisma.ts";
import { identifies, isSala, isPartialSala } from "./type_validation.ts";

const fastify = Fastify({
  logger: true,
});

fastify.get("/room", () => db.sala.findMany());
fastify.delete("/room/:id", async ({ params }, reply) => {
  if (identifies(params)) {
    await db.sala.delete({
      where: { id: params.id },
    });
    reply.send({ message: "OK" });
  } else {
    reply.status(404).send({ message: "Sala não encontrada." });
  }
});
fastify.post("/room", async ({ body }, reply) => {
  if (isSala(body)) {
    const { id } = await db.sala.create({
      data: body,
    });
    reply.status(201).send({ message: "OK", id });
  } else {
    reply.status(400).send({ message: "Sala mal formada" });
  }
});

fastify.put("/room/:id", async ({ body, params }, reply) => {
  if (
    identifies(params) &&
    (await db.sala.findUnique({ where: { id: params.id } })) !== null &&
    isSala(body)
  ) {
    await db.sala.update({
      where: { id: params.id },
      data: body,
    });
    reply.send({ message: "OK" });
  } else {
    reply.status(400).send({ message: "Alteração mal formada" });
  }
});

fastify.patch("/room/:id", async ({ body, params }, reply) => {
  if (
    identifies(params) &&
    (await db.sala.findUnique({ where: { id: params.id } })) !== null &&
    isPartialSala(body)
  ) {
    await db.sala.update({
      where: { id: params.id },
      data: body,
    });
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
