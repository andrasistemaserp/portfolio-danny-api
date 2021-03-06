const express = require('express')
const server = express()

async function runServer() {

  if (process.env.NODE_ENV !== "production") {
    require("dotenv").config(); //Load file .env for work with variables proccess.env in the enviroment of development
  }

  await require('./modules/db').connect();

  server.use(express.json())

  server.use('/api/v1/portfolios', require('./modules/routes/portfolios'))
  server.use('/api/v1/blogs', require('./modules/routes/blogs'))

  server.get('/', function(req, res, next) {
    // res.status(200).send({status: 200, mensagem: [{mensagem: 'Servidor ativo e aguardando instrução.'}]});
    // res.json({message: 'Welcome to Portfolio API Application'});
    res.sendFile('index.html', {root: __dirname})
  });
    
  const PORT = parseInt(process.env.PORT, 10) || 3001
  server.listen(PORT, (err) => {
    if (err) console.log(err)
    console.log('Server ready on port: ', PORT)
  })

}

runServer();