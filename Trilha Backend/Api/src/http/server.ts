import fastify from "fastify";
import { RoomController } from "./RoomController";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import { CreateUser } from "./CreateUser";
import fastifyJwt from "fastify-jwt";



const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(RoomController)
app.register(CreateUser)

app.register(fastifyJwt)

app.listen({port: 3333}).then(() => {
    console.log('HTTP server is running');
})

