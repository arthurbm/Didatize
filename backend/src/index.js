const express = require('express')

const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) =>{
    return res.send('Hello')
});

app.listen(3333);