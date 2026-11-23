import fastify, { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import "@fastify/jwt"
import { verifyPassword } from "../utils/hash";

export  const Login:FastifyPluginAsyncZod = async app =>{

    const loginSchema = z.object({
        Nome: z.string(),
        senha: z.string(),
    })

    app.post('/login', async (req,res) =>{

        const { Nome , senha } = loginSchema.parse(req.body)

        const user = await prisma.user.findUnique({
            where: { Nome } ,
        });
    

    if(!user) {
        return res.status(400).send({error: "usuario nao encontrado"});
    }

    const verificasenha = await verifyPassword(senha, user.senha)

    if(!verificasenha){
        return res.status(400).send({error: "senha errada"});
    }

    const token =  app.jwt.sign({id: user.id , Nome: user.Nome})

    return res.status(200).send({ token })

    })
}