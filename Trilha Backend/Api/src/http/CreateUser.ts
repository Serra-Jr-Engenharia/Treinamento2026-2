import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { hashpassword } from "../utils/hash";

export  const CreateUser:FastifyPluginAsyncZod = async app =>{

    const CreateUserSchema = z.object({
        Nome: z.string(),
        senha: z.string(),
    })

    app.post('/user', async (request, reply) => {
            const { Nome, senha } = CreateUserSchema.parse(request.body)
    
            if (!Nome || !senha ) {
                return reply.status(400).send({ error: 'preencha todos os campos' });
            }
            
            const existUser = await prisma.user.findUnique({
                where: { Nome },
            })
            
            if(existUser){
                return reply.status(400).send({error: 'Usuario ja existe'})
            }

            const hashedpassword = await hashpassword(senha)

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