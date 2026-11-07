import Fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const app = Fastify();
const prisma = new PrismaClient(); 

app.get('/room', async (request, reply) => {
    const salas = await prisma.room.findMany({
        include: {
            logs: {
                orderBy: { dataHora: 'desc' } 
            }
        }
    });
    return salas;
});

app.post('/room', async (request, reply) => {
    const { nome, capacidade, local, descricao } = request.body as any;
    
    const novaSala = await prisma.room.create({
        data: {
            nome,
            capacidade,
            local,
            descricao,

            logs: {
                create: {
                    acao: "CRIACAO",
                    detalhes: "Sala cadastrada no sistema"
                }
            }
        }
    });
    
    return reply.status(201).send(novaSala);
});

app.put('/room/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { nome, capacidade, local, descricao } = request.body as any;
    
    // Verifica se a sala existe no banco
    const salaExiste = await prisma.room.findUnique({ where: { id } });
    if (!salaExiste) {
        return reply.status(404).send({ erro: 'Sala não encontrada' });
    }
    
    const salaAtualizada = await prisma.room.update({
        where: { id },
        data: {
            nome,
            capacidade,
            local,
            descricao,
            logs: {
                create: {
                    acao: "ATUALIZACAO",
                    detalhes: "Dados da sala foram alterados"
                }
            }
        }
    });
    
    return salaAtualizada;
});

app.delete('/room/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const salaExiste = await prisma.room.findUnique({ where: { id } });
    if (!salaExiste) {
        return reply.status(404).send({ erro: 'Sala não encontrada' });
    }
    
    await prisma.room.delete({
        where: { id }
    });
    
    return reply.status(204).send(); 
});

app.listen({ port: 3333 }).then(() => {
    console.log('Servidor a rodar na porta 3333.');
});