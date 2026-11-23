import fastify from "fastify";
import { RoomController } from "./RoomController";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { CreateUser } from "./CreateUser";
import fastifyJwt from "@fastify/jwt";
import {Login} from "./login"


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(RoomController)
app.register(CreateUser)
app.register(Login)

app.register(fastifyJwt,{
    secret: "segredinhokaka"
})

app.listen({port: 3333}).then(() => {
    console.log('HTTP server is running');
})

