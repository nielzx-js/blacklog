const express = require('express');
const path = require('path');
const app = express();
const Jogo=require('./models/Jogo')
const sequelize=require('./database')
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended:true}))

const port = Number(process.env.PORT) || 3000
let databaseReady;

function initializeDatabase(){
    if(!databaseReady){
        databaseReady=sequelize.sync().then(()=>sequelize.getQueryInterface().changeColumn(
            Jogo.getTableName(),
            'nota',
            {type:Jogo.rawAttributes.nota.type,allowNull:true}
        ))
    }
    return databaseReady
}

app.use(async(req,res,next)=>{
    try{
        await initializeDatabase()
        next()
    }catch(error){
        console.error("Erro ao conectar ou preparar o banco:",error)
        res.status(500).send("Erro ao conectar com o banco de dados")
    }
})

app.get('/',(req,res)=>{
    res.redirect('/jogos')
})

app.get('/jogos',async(req,res)=>{
    try{
        const jogos=await Jogo.findAll()
        res.render('index',{jogos})

    }catch(error){
        console.error("Erro ao buscar",error)
        res.status(500).send("erro ao buscar jogo")
    }
})

//adicionar jogos
app.post('/jogos',async(req,res)=>{
    try{
        const {titulo,plataforma,status,nota}=req.body
        await Jogo.create({
            titulo,
            plataforma,
            status,
            nota:nota ? parseFloat(nota) : null
        })
        res.redirect('/jogos')
    }catch(error){
        console.error("Erro ao adicionar jogo:",error)
        res.status(500).send("Erro ao adicionar jogo")
    }
})

//deletar jogo
app.post('/jogo/deletar/:id',async(req,res)=>{
    try{
        const {id} = req.params
        await Jogo.destroy({where:{id}})
        res.redirect('/jogos')
    }catch(error){
        console.log("erro ao deletar",error)
        res.status(500).send("erro ao deletar")
    }
})

//editar
app.get('/jogos/editar/:id',async(req,res)=>{
    try{
        const{id}=req.params
        const jogo = await Jogo.findByPk(id)

        if(!jogo){
            return res.status(404).send("Jogo não encontrado")
        }

        res.render('editar',{jogo})
    }catch(error){
        console.error("erro ao editar",error)
        res.status(500).send("erro")
    }
})

app.post('/jogos/editar/:id',async(req,res)=>{
    try{
      const {id}=req.params
     const {titulo,plataforma,status,nota}=req.body

     await Jogo.update({
        titulo,
        plataforma,
        status,
        nota:nota ? parseFloat(nota) : null
     },
    { where: { id } }
    );
    res.redirect('/jogos')
    }catch(error){
        console.error('Erro ao atualizar jogo:', error);
    res.status(500).send('Erro ao atualizar jogo');
    }
})



if(require.main===module){
    initializeDatabase().then(()=>{
        app.listen(port,()=>{
            console.log(`rodando em http://localhost:${port}`)
        })
    }).catch(error=>{
        console.error("Erro ao iniciar o servidor ou preparar o banco:",error)
        process.exitCode=1
    })
}

module.exports=app