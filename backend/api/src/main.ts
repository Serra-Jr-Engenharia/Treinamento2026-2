import Fastify from "fastify";
import db from "./prisma.ts";
import z from "zod";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";

type PartialAndUndefinable<R> = {
  [K in keyof R]?: R[K] | undefined;
};

const withFallback = <R extends Record<keyof any, any>>(
  priority: PartialAndUndefinable<R>,
  fallback: R,
): R => {
  for (const key in fallback) priority[key] ||= fallback[key];
  return priority as R; // Isso é seguro, a partir do momento que definimos todas chaves ausentes em priority com chaves respectives em fallback.
};

const SalaSchema = z.object({
  nome: z.string().min(5).max(20),
  descricao: z.string(),
  capacidade: z.number().min(2).max(100),
  local: z.string(),
});

const IdSchema = z.object({
  id: z.uuid(),
});

const fastify = Fastify({
  logger: true,
})
  .withTypeProvider<ZodTypeProvider>()
  .setSerializerCompiler(serializerCompiler)
  .setValidatorCompiler(validatorCompiler);

fastify.get(
  "/room",
  { schema: { response: { 200: z.array(SalaSchema) } } },
  () => db.sala.findMany(),
);
fastify.delete(
  "/room/:id",
  {
    schema: {
      params: IdSchema,
      response: {
        200: z.object({ message: z.literal("OK") }),
        404: z.object({ message: z.literal("Sala inexistente") }),
      },
    },
  },
  async ({ params }, reply) => {
    if ((await db.sala.findUnique({ where: { id: params.id } })) !== null) {
      await db.sala.delete({
        where: { id: params.id },
      });
      reply.status(200).send({ message: "OK" });
    } else {
      reply.status(404).send({ message: "Sala inexistente" });
    }
  },
);
fastify.post(
  "/room",
  {
    schema: {
      body: SalaSchema,
      response: {
        201: z.object({ message: z.literal("OK"), id: z.string() }),
      },
    },
  },
  async ({ body }, reply) => {
    const { id } = await db.sala.create({
      data: body,
    });
    reply.status(201).send({ message: "OK", id });
  },
);

fastify.put(
  "/room/:id",
  {
    schema: {
      body: SalaSchema,
      params: IdSchema,
      response: {
        200: z.object({ message: z.literal("OK") }),
        404: z.object({ message: z.literal("Sala inexistente") }),
      },
    },
  },
  async ({ body, params }, reply) => {
    if ((await db.sala.findUnique({ where: { id: params.id } })) !== null) {
      await db.sala.update({
        where: { id: params.id },
        data: body,
      });
      reply.send({ message: "OK" });
    } else {
      reply.status(404).send({ message: "Sala inexistente" });
    }
  },
);

fastify.patch(
  "/room/:id",
  {
    schema: {
      body: z.deepPartial(SalaSchema),
      params: IdSchema,
      response: {
        200: z.object({ message: z.literal("OK") }),
        404: z.object({ message: z.literal("Sala inexistente") }),
      },
    },
  },
  async ({ body, params }, reply) => {
    const maybeSala = await db.sala.findUnique({ where: { id: params.id } });
    if (maybeSala !== null) {
      const { id: _, ...sala } = maybeSala; // só queremos excluir o id da estrutura pra fazer o withFallback
      await db.sala.update({
        where: { id: params.id },
        data: withFallback(body, sala),
      });
      reply.send({ message: "OK" });
    } else {
      reply.status(404).send({ message: "Sala inexistente" });
    }
  },
);

fastify.listen({ port: 3000 }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});
