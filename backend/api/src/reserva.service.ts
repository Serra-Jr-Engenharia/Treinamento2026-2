import { PrismaClient } from '@prisma/client';

export class ReservaErro extends Error {
  statusCode: number;

  constructor(mensagem: string, statusCode = 400) {
    super(mensagem);
    this.statusCode = statusCode;
  }
}

export async function verificarConflitoHorario(
  prisma: PrismaClient,
  roomId: string,
  dataInicio: Date,
  dataFim: Date,
  ignorarReservaId?: string
) {
  const conflito = await prisma.reservation.findFirst({
    where: {
      roomId,
      ...(ignorarReservaId ? { id: { not: ignorarReservaId } } : {}),
      dataInicio: { lt: dataFim },
      dataFim: { gt: dataInicio },
    },
  });

  if (conflito) {
    throw new ReservaErro(
      'Já existe uma reserva para esta sala nesse dia e horário.',
      409
    );
  }
}

export async function criarReservaNoBanco(
  prisma: PrismaClient,
  userId: string,
  roomId: string,
  dataInicio: Date,
  dataFim: Date
) {
  const salaExiste = await prisma.room.findUnique({ where: { id: roomId } });
  if (!salaExiste) {
    throw new ReservaErro('Sala não encontrada.', 404);
  }

  await verificarConflitoHorario(prisma, roomId, dataInicio, dataFim);

  return prisma.reservation.create({
    data: {
      userId,
      roomId,
      dataInicio,
      dataFim,
    },
    include: {
      room: {
        select: { id: true, nome: true, local: true },
      },
    },
  });
}

export async function cancelarReservaNoBanco(
  prisma: PrismaClient,
  reservaId: string,
  userId: string
) {
  const reserva = await prisma.reservation.findUnique({
    where: { id: reservaId },
  });

  if (!reserva) {
    throw new ReservaErro('Reserva não encontrada.', 404);
  }

  if (reserva.userId !== userId) {
    throw new ReservaErro('Você não tem permissão para cancelar esta reserva.', 403);
  }

  await prisma.reservation.delete({
    where: { id: reservaId },
  });
}

export async function alterarHorarioReservaNoBanco(
  prisma: PrismaClient,
  reservaId: string,
  userId: string,
  dataInicio: Date,
  dataFim: Date
) {
  const reserva = await prisma.reservation.findUnique({
    where: { id: reservaId },
  });

  if (!reserva) {
    throw new ReservaErro('Reserva não encontrada.', 404);
  }

  if (reserva.userId !== userId) {
    throw new ReservaErro('Você não tem permissão para alterar esta reserva.', 403);
  }

  await verificarConflitoHorario(
    prisma,
    reserva.roomId,
    dataInicio,
    dataFim,
    reservaId
  );

  return prisma.reservation.update({
    where: { id: reservaId },
    data: { dataInicio, dataFim },
    include: {
      room: {
        select: { id: true, nome: true, local: true },
      },
    },
  });
}

export async function buscarReservasDoUsuario(
  prisma: PrismaClient,
  userId: string
) {
  return prisma.reservation.findMany({
    where: { userId },
    include: {
      room: {
        select: { id: true, nome: true, local: true, capacidade: true },
      },
    },
    orderBy: { dataInicio: 'asc' },
  });
}

export async function listarReservasPorSala(
  prisma: PrismaClient,
  roomId: string
) {
  const salaExiste = await prisma.room.findUnique({ where: { id: roomId } });
  if (!salaExiste) {
    throw new ReservaErro('Sala não encontrada.', 404);
  }

  return prisma.reservation.findMany({
    where: { roomId },
    include: {
      user: {
        select: { id: true, nome: true, email: true },
      },
    },
    orderBy: { dataInicio: 'asc' },
  });
}