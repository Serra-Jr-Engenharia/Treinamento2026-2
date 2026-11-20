import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

export  const CreateUser:FastifyPluginAsyncZod = async app =>{
    app.post('/user',{
            schema:{
                body: z.object({
                    Nome: z.string(),
                    senha: z.string()
                }),
            
            response: {
                201: z.object({
                    id:      z.number(),
                    Nome:    z.string(),
                    senha:   z.string(),
                }),
                500: z.object({
                    error: z.string(),
                })
            }
            }
        },
        async (request, reply) => {
            const { Nome, senha } = request.body
    
            if (!Nome || !senha ) {
                return reply.status(400).send({ error: 'preencha todos os campos' });
            }
            
            const existUser = await prisma.user.findUnique({
                where: { Nome },
            })
            
            if(existUser){
                return reply.status(400).send({error: 'Usuario ja existe'})
            }
            try {
                const newUser = await prisma.user.create({
                    data: { 
                        Nome, 
                        senha 
                    }
                });
                return reply.status(201).send(newUser);
            } catch {
                return reply.status(500).send({ error: 'erro ao criar o Usuario' });
            }
        });
}