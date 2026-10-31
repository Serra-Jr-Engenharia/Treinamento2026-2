import Fastify from 'fastify';
import { randomUUID } from 'node:crypto';

const app = Fastify();

interface Sala {
    id: string;
    nome: string;
    capacidade: number;
    local: string;
    descricao: string;
}

let salas: Sala[] = [];

app.get('/room', async (request, reply) => {
    return salas;
});

app.post('/room', async (request, reply) => {
    const { nome, capacidade, local, descricao } = request.body as Omit<Sala, 'id'>;
    
    const novaSala: Sala = {
        id: randomUUID(), 
        nome,
        capacidade,
        local,
        descricao
    };
    
    salas.push(novaSala);
    return reply.status(201).send(novaSala);
});

app.put('/room/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const { nome, capacidade, local, descricao } = request.body as Omit<Sala, 'id'>;
    
    const salaIndex = salas.findIndex(sala => sala.id === id);
    
    if (salaIndex === -1) {
        return reply.status(404).send({ erro: 'Sala não encontrada' });
    }
    
    salas[salaIndex] = { ...salas[salaIndex], nome, capacidade, local, descricao };
    return salas[salaIndex];
});

app.delete('/room/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const salaIndex = salas.findIndex(sala => sala.id === id);
    
    if (salaIndex === -1) {
        return reply.status(404).send({ erro: 'Sala não encontrada' });
    }
    
    salas.splice(salaIndex, 1);
    return reply.status(204).send(); 
});

app.listen({ port: 3333 }).then(() => {
    console.log('Servidor a rodar na porta 3333.');
});