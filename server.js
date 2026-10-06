const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'))

const port = 3000

const jogos = [
  { id: 1, titulo: "God of War Ragnarök", plataforma: "PS5", status: "zerado", nota: 10 },
  { id: 2, titulo: "Elden Ring", plataforma: "PC", status: "jogado", nota:7.0 },
  { id: 3, titulo: "Hollow Knight", plataforma: "Switch", status: "quero jogar", nota: 3 },
  { id: 4, titulo: "The Witcher 3", plataforma: "PC", status:"jogando",nota:null}

];

app.get('/',(req,res)=>{
    res.render('index',{jogos})
})

const server=app.listen(port,()=>{
    console.log("rodando")
    console.log(`http://localhost:${port}`)
})
server.on("error",(err)=>{
    console.log("erro ao iniciar o servidor",err)
})