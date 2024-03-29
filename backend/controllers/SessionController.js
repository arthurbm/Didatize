const express = require('express');
//Importando o nosso modelo User
const User = require('../models/User');

// Para podermos definir e trabalhar com as nossas rotas
const router = express.Router();

/**
 * Rota de autenticação
 */
router.post('/authenticate', async(req, res) => {
    const { email, password } = req.body;
    //O password nao vem no retorno de consultas, por isso usamos o metodo select
    const user = await User.findOne({ email }).select('+password');
    if (!user)
      return res.status(400).send({ error: 'User not found' });
    if (!password)
      return res.status(400).send({ error: 'Invalid password' });
    user.password = undefined;
    res.send({ 
      user, 
      password 
    });
});

/*
* Rota de cadastro. Uso do async (a partir do node 9) para tratar promises com 
* o await.
*/
router.post('/register', async (req, res) => {
    const { email, password, city, state } = req.body;
    try {
        //Se o email já existir, não deixar cadastrar o usuário e informar o erro
        if (await User.findOne({ email })) {
        return res.status(400).send({ error: 'User already exists' });
        }
        const user = await User.create(req.body); //await para esperar o create
        
        return res.send({ 
        user,
        });
    } catch(err){
        return res.status(400).send({ error: 'Registration failed' });
    }
});

/** Definindo o router para ser utilizado dentro do app. Toda vez que o usuário 
 * acessar /session nosso router vai ser chamado. Com isso teremos uma rota
 * /session/register
 */
module.exports = app => app.use('/session', router);