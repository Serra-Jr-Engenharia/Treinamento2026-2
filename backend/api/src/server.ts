import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify';
import fastifyJwt from '@fastify/jwt';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';
import { roomSchema, idParamSchema, type Salas } from './salas.schema.js';
import {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
} from './auth.schema.js';

const app = Fastify();
const prisma = new PrismaClient();

await app.register(fastifyJwt, {
  secret: process.env.JWT_SECRET || 'chave-secreta-desenvolvimento-serrajr',
});

async function autenticarUsuario(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (error) {
    return reply.status(401).send({
      sucesso: false,
      mensagem: 'Não autorizado. Token inválido ou ausente.',
    });
  }
}

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      sucesso: false,
      mensagem: 'Erro na validação dos dados enviados.',
      erros: error.issues.map((issue) => ({
        campo: issue.path.join('.'),
        mensagem: issue.message,
      })),
    });
  }

  return reply.status(500).send({
    sucesso: false,
    mensagem: 'Erro interno no servidor.',
  });
});


app.post('/auth/register', async (request, reply) => {
  try {
    const { nome, email, senha } = registerSchema.parse(request.body);

    const emailEmUso = await prisma.user.findUnique({ where: { email } });
    if (emailEmUso) {
      return reply.status(409).send({
        sucesso: false,
        mensagem: 'Este e-mail já está cadastrado.',
      });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const novoUsuario = await prisma.user.create({
      data: {
        nome,
        email,
        senha: senhaHash,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        criadoEm: true,
      },
    });

    return reply.status(201).send({
      sucesso: true,
      mensagem: 'Usuário cadastrado com sucesso.',
      dados: novoUsuario,
    });
  } catch (error) {
    if (error instanceof ZodError) throw error;
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao cadastrar usuário.',
    });
  }
});

app.post('/auth/login', async (request, reply) => {
  try {
    const { email, senha } = loginSchema.parse(request.body);

    const usuario = await prisma.user.findUnique({ where: { email } });
    if (!usuario) {
      return reply.status(401).send({
        sucesso: false,
        mensagem: 'E-mail ou senha inválidos.',
      });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return reply.status(401).send({
        sucesso: false,
        mensagem: 'E-mail ou senha inválidos.',
      });
    }

    const token = app.jwt.sign(
      {
        sub: usuario.id,
        email: usuario.email,
      },
      { expiresIn: '1d' }
    );

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) throw error;
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao realizar login.',
    });
  }
});


app.patch('/auth/password', { preHandler: [autenticarUsuario] }, async (request, reply) => {
  try {
    const { senhaAtual, novaSenha } = updatePasswordSchema.parse(request.body);
    const userId = request.user.sub;

    const usuario = await prisma.user.findUnique({ where: { id: userId } });
    if (!usuario) {
      return reply.status(404).send({
        sucesso: false,
        mensagem: 'Usuário não encontrado.',
      });
    }

    const senhaAtualConfere = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaAtualConfere) {
      return reply.status(401).send({
        sucesso: false,
        mensagem: 'A senha atual está incorreta.',
      });
    }

    const novaSenhaHash = await bcrypt.hash(novaSenha, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { senha: novaSenhaHash },
    });

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Senha atualizada com sucesso.',
    });
  } catch (error) {
    if (error instanceof ZodError) throw error;
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao atualizar a senha.',
    });
  }
});


app.get('/room', { preHandler: [autenticarUsuario] }, async (request, reply) => {
  try {
    const salas = await prisma.room.findMany({
      include: {
        logs: {
          orderBy: { dataHora: 'desc' },
        },
      },
    });

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Salas listadas com sucesso.',
      dados: salas,
    });
  } catch (error) {
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao buscar as salas.',
    });
  }
});

app.post('/room', { preHandler: [autenticarUsuario] }, async (request, reply) => {
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
            acao: 'CRIACAO',
            detalhes: `Sala cadastrada por ${request.user.email}`,
          },
        },
      },
    });

    return reply.status(201).send({
      sucesso: true,
      mensagem: 'Sala criada com sucesso.',
      dados: novaSala,
    });
  } catch (error) {
    if (error instanceof ZodError) throw error;
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao criar a sala.',
    });
  }
});

app.put('/room/:id', { preHandler: [autenticarUsuario] }, async (request, reply) => {
  try {
    const { id } = idParamSchema.parse(request.params);
    const dadosValidados: Salas = roomSchema.parse(request.body);

    const salaExiste = await prisma.room.findUnique({ where: { id } });
    if (!salaExiste) {
      return reply.status(404).send({
        sucesso: false,
        mensagem: 'Sala não encontrada.',
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
            acao: 'ATUALIZACAO',
            detalhes: `Dados alterados por ${request.user.email}`,
          },
        },
      },
    });

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Sala atualizada com sucesso.',
      dados: salaAtualizada,
    });
  } catch (error) {
    if (error instanceof ZodError) throw error;
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao atualizar a sala.',
    });
  }
});

app.delete('/room/:id', { preHandler: [autenticarUsuario] }, async (request, reply) => {
  try {
    const { id } = idParamSchema.parse(request.params);

    const salaExiste = await prisma.room.findUnique({ where: { id } });
    if (!salaExiste) {
      return reply.status(404).send({
        sucesso: false,
        mensagem: 'Sala não encontrada.',
      });
    }

    await prisma.room.delete({
      where: { id },
    });

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Sala removida com sucesso.',
    });
  } catch (error) {
    if (error instanceof ZodError) throw error;
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao remover a sala.',
    });
  }
});

app.listen({ port: 3333 }).then(() => {
  console.log('Servidor a rodar na porta 3333.');
});