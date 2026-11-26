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
import {
  criarReservaSchema,
  atualizarReservaSchema,
  reservaIdParamSchema,
  roomIdParamSchema,
} from './reserva.schema.js';
import {
  ReservaErro,
  criarReservaNoBanco,
  cancelarReservaNoBanco,
  alterarHorarioReservaNoBanco,
  buscarReservasDoUsuario,
  listarReservasPorSala,
} from './reserva.service.js';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: string;
      email: string;
    };
    user: {
      sub: string;
      email: string;
    };
  }
}

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

  if (error instanceof ReservaErro) {
    return reply.status(error.statusCode).send({
      sucesso: false,
      mensagem: error.message,
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

// 1. Criar uma reserva (bloqueia conflito de dia e horário na mesma sala)
app.post('/reservations', { preHandler: [autenticarUsuario] }, async (request, reply) => {
  try {
    const { roomId, dataInicio, dataFim } = criarReservaSchema.parse(request.body);
    const reserva = await criarReservaNoBanco(
      prisma,
      request.user.sub,
      roomId,
      dataInicio,
      dataFim
    );

    return reply.status(201).send({
      sucesso: true,
      mensagem: 'Reserva criada com sucesso.',
      dados: reserva,
    });
  } catch (error) {
    if (error instanceof ZodError || error instanceof ReservaErro) throw error;
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao criar reserva.',
    });
  }
});

// 2. Buscar reservas do usuário autenticado
app.get('/reservations/me', { preHandler: [autenticarUsuario] }, async (request, reply) => {
  try {
    const reservas = await buscarReservasDoUsuario(prisma, request.user.sub);

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Reservas do usuário listadas com sucesso.',
      dados: reservas,
    });
  } catch (error) {
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao buscar reservas do usuário.',
    });
  }
});

// 3. Alterar data e horário da reserva (bloqueia conflito de dia e horário)
app.patch('/reservations/:id', { preHandler: [autenticarUsuario] }, async (request, reply) => {
  try {
    const { id } = reservaIdParamSchema.parse(request.params);
    const { dataInicio, dataFim } = atualizarReservaSchema.parse(request.body);

    const reservaAtualizada = await alterarHorarioReservaNoBanco(
      prisma,
      id,
      request.user.sub,
      dataInicio,
      dataFim
    );

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Data e horário da reserva atualizados com sucesso.',
      dados: reservaAtualizada,
    });
  } catch (error) {
    if (error instanceof ZodError || error instanceof ReservaErro) throw error;
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao atualizar a reserva.',
    });
  }
});

// 4. Cancelar uma reserva
app.delete('/reservations/:id', { preHandler: [autenticarUsuario] }, async (request, reply) => {
  try {
    const { id } = reservaIdParamSchema.parse(request.params);
    await cancelarReservaNoBanco(prisma, id, request.user.sub);

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Reserva cancelada com sucesso.',
    });
  } catch (error) {
    if (error instanceof ZodError || error instanceof ReservaErro) throw error;
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao cancelar a reserva.',
    });
  }
});

// 5. Fator de inovação: listar reservas por sala
app.get('/rooms/:roomId/reservations', { preHandler: [autenticarUsuario] }, async (request, reply) => {
  try {
    const { roomId } = roomIdParamSchema.parse(request.params);
    const reservas = await listarReservasPorSala(prisma, roomId);

    return reply.status(200).send({
      sucesso: true,
      mensagem: 'Reservas da sala listadas com sucesso.',
      dados: reservas,
    });
  } catch (error) {
    if (error instanceof ZodError || error instanceof ReservaErro) throw error;
    return reply.status(500).send({
      sucesso: false,
      mensagem: 'Erro ao listar reservas da sala.',
    });
  }
});

app.listen({ port: 3333 }).then(() => {
  console.log('Servidor a rodar na porta 3333.');
});