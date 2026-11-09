import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

interface Room {
    id: number;
    quartos: number;
    preco: number;
}

export default async function RoomController(app: FastifyInstance) {

    app.post('/room', async (request, reply) => {
        const { quartos, preco } = request.body as Room;

        if (!quartos || !preco ) {
            return reply.status(400).send({ error: 'preencha todos os campos' });
        }

        try {
            const newRoom = await prisma.room.create({
                data: { 
                    quartos, 
                    preco 
                }
            });
            return reply.status(201).send(newRoom);
        } catch {
            return reply.status(500).send({ error: 'erro ao criar a sala' });
        }
    });

    app.get('/room', async (_, reply) => {
        try {
            const rooms = await prisma.room.findMany();
            return reply.send(rooms);
        } catch {
            return reply.status(500).send({ error: 'erro ao buscar as salas' });
        }
    });

    app.put('/room/:id', async (request, reply) => {
        const { id } = request.params as { id: string };
        const { quartos, preco } = request.body as Room;

        if (!quartos || !preco ) {
            return reply.status(400).send({ error: 'preencha todos os campos' });
        }

        try {
            const updatedRoom = await prisma.room.update({
                where: { id: parseInt(id) },
                data: { quartos, preco }
            });
            return reply.status(200).send(updatedRoom);
        } catch {
            return reply.status(500).send({ error: 'erro ao atualizar a sala' });
        }
    });

    app.delete('/room/:id', async (request, reply) => {
        const { id } = request.params as { id: string };

        try {
            await prisma.room.delete({
                where: { id: parseInt(id) }
            });
            return reply.status(200).send({ message: 'sala deletada' });
        } catch {
            return reply.status(500).send({ error: 'erro ao deletar a sala' });
        }
    });
}