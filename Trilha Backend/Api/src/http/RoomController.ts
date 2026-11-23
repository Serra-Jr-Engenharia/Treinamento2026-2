import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export  const RoomController:FastifyPluginAsyncZod = async app =>{

    app.addHook("onRequest", async (request,reply)=> {
        try{
            await request.jwtVerify()
        }
        catch( error ) {
            return reply.status(401).send({ error })
        }

    })

    app.post('/room',{
        schema:{
            body: z.object({
                quartos: z.number(),
                preco:  z.number()
            }),
        
        response: {
            201: z.object({
                id:      z.number(),
                quartos: z.number(),
                preco:   z.number(),
            }),
            500: z.object({
                error: z.string(),
            })
        }
        }
    },
    async (request, reply) => {
        const { quartos, preco } = request.body

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

    app.get('/room', {
        schema:{
            response: {
                200: z.array(z.object({
                    id:      z.number(),
                    quartos: z.number(),
                    preco:   z.number()
                })),
                500: z.object({
                    error: z.string()
                })
            }
        }
    } , async (_, reply) => {
        try {
            const rooms = await prisma.room.findMany();
            return reply.send(rooms);
        } catch {
            return reply.status(500).send({ error: 'erro ao buscar as salas' });
        }
    });

    app.put('/room/:id',{
        schema:{
            params: z.object({
                id: z.string()
            }),
            body: z.object({
                quartos: z.number(),
                preco: z.number()
            }),
            response:{
                200: z.object({
                    id:      z.number(),
                    quartos: z.number(),
                    preco:   z.number()
                }),
                500: z.object({
                    error: z.string()
                })
            }

        }
    }, async (request, reply) => {
        const { id } = request.params
        const { quartos, preco } = request.body

        const roomid = parseInt(id)
        if (!quartos || !preco ) {
            return reply.status(400).send({ error: 'preencha todos os campos' });
        }

        try {
            const updatedRoom = await prisma.room.update({
                where: { id: roomid },
                data: { quartos, preco }
            });
            return reply.status(200).send(updatedRoom);
        } catch {
            return reply.status(500).send({ error: 'erro ao atualizar a sala' });
        }
    });

    app.delete('/room/:id',{
        schema:{
            params: z.object({
                id: z.string()
            }),
            response:{
                200: z.object({
                    message: z.string()
                }),
                500: z.object({
                    error: z.string()
                })
            }
        }
    }, async (request, reply) => {
        const { id } = request.params
        
        const roomid = parseInt(id)

        try {
            await prisma.room.delete({
                where: { id: roomid }
            });
            return reply.status(200).send({ message: 'sala deletada' });
        } catch {
            return reply.status(500).send({ error: 'erro ao deletar a sala' });
        }
    });
}