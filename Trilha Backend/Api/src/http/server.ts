import fastify from "fastify";
import { RoomController } from "./RoomController";
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";



const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setSerializerCompiler(serializerCompiler)
app.setValidatorCompiler(validatorCompiler)

app.register(RoomController)

app.listen({port: 3333}).then(() => {
    console.log('HTTP server is running');
})

