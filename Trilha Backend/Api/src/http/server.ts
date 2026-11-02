import fastify from 'fastify'
import {randomUUID} from 'node:crypto'
const app = fastify();

app.listen({port: 3333}).then(() => {
    console.log('HTTP server is running');
    
})

interface room {
    id: string;
    quartos: number;
    preco: number;
}
const rooms : room[] = []


app.post('/room',(request,reply) => {
    const {quartos,preco} = request.body as room
    if(!quartos || !preco){
        reply.status(400).send({error : 'preencha todos os campos'})
        return
    }
    const rom: room = {
        id: randomUUID(),
        quartos,
        preco
    }
    rooms.push(rom)
    reply.status(201).send({message :'sala criada com sucesso'})
})

app.get('/room' , (request,reply) => {
    return rooms
})

app.put('/room/:id', (request,reply) => {
    const {id} = request.params as room

    const {quartos, preco} = request.body as room
    
    const roomindex = rooms.findIndex(r => r.id == id)

    if(roomindex == -1){
        return reply.status(404).send({error:'sala nao encontrada'})
    }
    if(!quartos || !preco){
        reply.status(400).send({error : 'preencha todos os campos'})
        return
    }
    
    rooms[roomindex] = {id,quartos,preco}
    reply.status(200).send({message: 'sala atualizada'})

})
app.delete('/room/:id', (request,reply) => {
    const {id} = request.params as room
    
    const roomindex = rooms.findIndex(r => r.id == id)

    if(roomindex == -1){
        return reply.status(404).send({error:'sala nao encontrada'})
    }
    rooms.splice(roomindex, 1)
    reply.status(200).send({message: 'sala deletada'})
})
