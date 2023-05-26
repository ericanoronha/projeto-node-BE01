//inicia express
const express = require('express')

// importa módulo de conexão com banco de dados
const conectaBancoDeDados = require('./bancoDeDados')
conectaBancoDeDados()

// importa modelo de objeto
const Mulher = require('./mulherModel')

// configura estruturas de rotas com express
const router = express.Router()

// importa pacote CORS no servidor para consumo da API client-side
const cors = require('cors')

//inicia aplicação
const app = express()

//tratamento de requisições para formato JSON com express
app.use(express.json())

app.use(cors())

const porta = 3333

//método GET
async function mostraMulheres(request, response) {
    try {
        const mulheresVindasDoBancoDeDados = await Mulher.find()
        response.json(mulheresVindasDoBancoDeDados)
    } catch (erro) {
        console.log(erro)
    }
}

//método POST
async function adicionaMulher(request, response) {
    const novaMulher = new Mulher({
        nome: request.body.nome,
        imagem: request.body.imagem,
        minibio: request.body.minibio
    })
    try {
        const mulherCriada = await novaMulher.save()
        response.status(201).json(mulherCriada)
    } catch (erro) {
        console.log(erro)
    }
}

//método PATCH
async function atualizaMulher(request, response) {
    try {
        //encontra mulher através do ID do parâmetro da requisição
        const mulherEncontrada = await Mulher.findById(request.params.id)

        if (request.body.nome) {
            mulherEncontrada.nome = request.body.nome
        }
        if (request.body.minibio) {
            mulherEncontrada.minibio = request.body.minibio
        }
        if (request.body.imagem) {
            mulherEncontrada.imagem = request.body.imagem
        }

        const mulherAtualizadaNoBanco = await mulherEncontrada.save()
        response.json(mulherAtualizadaNoBanco)

    } catch (erro) {
        console.log(erro)
    }
}

//método DELETE
async function deletaMulher(request, response) {
    try {
        await Mulher.findByIdAndDelete(request.params.id)
        response.json({
            mensagem: 'Mulher deletada com sucesso'
        })
    } catch (erro) {
        console.log(erro)
    }
}

//função de exibição de confirmação de servidor rodando
function mostraPorta() {
    console.log('Servidor criado e rodando na porta ', porta)
}

//configura rota GET do servidor
app.use(router.get('/mulheres', mostraMulheres))

//executa função de escuta de porta
app.listen(porta, mostraPorta)

//configura rota POST do servidor
app.use(router.post('/mulheres', adicionaMulher))

//configura rota PATCH do servidor
app.use(router.patch('/mulheres/:id', atualizaMulher))

//configura rota DELETE do servidor
app.use(router.delete('/mulheres/:id', deletaMulher))