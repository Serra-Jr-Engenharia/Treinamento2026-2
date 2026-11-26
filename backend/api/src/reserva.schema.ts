import { z } from 'zod';

export const criarReservaSchema = z
  .object({
    roomId: z.string().uuid('O ID da sala deve ser um UUID válido'),
    dataInicio: z.coerce.date({
      error: 'Informe uma data e horário de início válidos',
    }),
    dataFim: z.coerce.date({
      error: 'Informe uma data e horário de término válidos',
    }),
  })
  .refine((data) => data.dataFim > data.dataInicio, {
    message: 'O horário de término deve ser posterior ao horário de início',
    path: ['dataFim'],
  });

export const atualizarReservaSchema = z
  .object({
    dataInicio: z.coerce.date({
      error: 'Informe uma data e horário de início válidos',
    }),
    dataFim: z.coerce.date({
      error: 'Informe uma data e horário de término válidos',
    }),
  })
  .refine((data) => data.dataFim > data.dataInicio, {
    message: 'O horário de término deve ser posterior ao horário de início',
    path: ['dataFim'],
  });

export const reservaIdParamSchema = z.object({
  id: z.string().uuid('O ID da reserva deve ser um UUID válido'),
});

export const roomIdParamSchema = z.object({
  roomId: z.string().uuid('O ID da sala deve ser um UUID válido'),
});