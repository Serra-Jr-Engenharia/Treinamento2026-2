import fastify from "fastify";
import RoomController from "./RoomController";

const app = fastify();
app.register(RoomController)

app.listen({port: 3333}).then(() => {
    console.log('HTTP server is running');
})

