import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';
import { ZodError } from 'zod';
import { roomSchema, idParamSchema, type Salas } from './salas.schema.js';

const app = Fastify();
const prisma = new PrismaClient();

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      sucesso: false,
      mensagem: 'Erro na validação dos dados enviados.',
      erros: error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message
      }))
    });
  }

  return reply.status(500).send({
    sucesso: false,
    mensagem: 'Erro interno no servidor.'
  });
});

app.get('/room', async (request, reply) => {
  try {
    const salas = await prisma.room.findMany({
      include: {
        logs: {
          orderBy: { dataHora: 'desc' }
        }
      }
    });

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Salas listadas com sucesso.',
      dados: salas
    });
  } catch (error) {
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao buscar as salas.'
    });
  }
});

app.post('/room', async (request, reply) => {
  try {
    const dadosValidados: Salas = roomSchema.parse(request.body);

    const novaSala = await prisma.room.create({
      data: {
        nome: dadosValidados.nome,
        capacidade: dadosValidados.capacidade,
        local: dadosValidados.local,
        descricao: dadosValidados.descricao,
        logs: {
          create: {
            acao: "CRIACAO",
            detalhes: "Sala cadastrada no sistema"
          }
        }
      }
    });

    return reply.status(201).send({
      sucesso: true,
      mensagem: 'Sala criada com sucesso.',
      dados: novaSala
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao criar a sala.'
    });
  }
});

app.put('/room/:id', async (request, reply) => {
  try {
    const { id } = idParamSchema.parse(request.params);
    const dadosValidados: Salas = roomSchema.parse(request.body);

    const salaExiste = await prisma.room.findUnique({ where: { id } });
    if (!salaExiste) {
      return reply.status(404).send({
        sucesso: false,
        mensagem: 'Sala não encontrada.'
      });
    }

    const salaAtualizada = await prisma.room.update({
      where: { id },
      data: {
        nome: dadosValidados.nome,
        capacidade: dadosValidados.capacidade,
        local: dadosValidados.local,
        descricao: dadosValidados.descricao,
        logs: {
          create: {
            acao: "ATUALIZACAO",
            detalhes: "Dados da sala foram alterados"
          }
        }
      }
    });

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Sala atualizada com sucesso.',
      dados: salaAtualizada
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao atualizar a sala.'
    });
  }
});

app.delete('/room/:id', async (request, reply) => {
  try {
    const { id } = idParamSchema.parse(request.params);

    const salaExiste = await prisma.room.findUnique({ where: { id } });
    if (!salaExiste) {
      return reply.status(404).send({
        sucesso: false,
        mensagem: 'Sala não encontrada.'
      });
    }

    await prisma.room.delete({
      where: { id }
    });

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Sala removida com sucesso.'
    });
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao remover a sala.'
    });
  }
});

app.listen({ port: 3333 }).then(() => {
  console.log('Servidor a rodar na porta 3333.');
});