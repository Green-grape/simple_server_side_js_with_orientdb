const express=require("express");
const query=require("./orientdb.js");
const fs=require("fs");
const app=express();
const port=5502;
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "pug");
app.set("views","./views");
app.locals.pretty=true;

app.get("/topic/add", async function(req,res){
    let sql="SELECT * FROM topic";
    let param="";
    await query(sql,param,function(topics){
        res.render("add",{
            topics:topics
        });
    });
});

app.post("/topic/add", async function(req, res){
    const title=req.body.title;
    const desc=req.body.description;
    const author=req.body.author;
    const sql=`
        INSERT INTO topic SET title="${title}", description="${desc}", author="${author}"
    `;
    await query(sql,"",function(results){
        res.redirect("/topic/"+encodeURIComponent(results[0]['@rid']));
    })
})

app.get(["/topic","/topic/:id"], async function(req, res){//[]를 이용해서여러개의 URL로 접근가능
    let sql="SELECT * FROM topic";
    let param="";
    await query(sql,param,function(topics){
        const id=req.params.id;
        if(id){
            sql="SELECT FROM topic WHERE @rid=:rid";
            param={
                params:{
                    rid:id
                }
            };
            query(sql,param,function(mainTopic){
                res.render("topic",{
                    topics:topics,
                    topic:mainTopic[0]
                });
            })
        }else{
            res.render("topic",{
                topics:topics
            });
        }
    });
});

app.get("/topic/:id/edit",async function(req,res){
    let sql="SELECT * FROM topic";
    const id=req.params.id;
    let param="";
    await query(sql,param,function(topics){
        let topic;
        for(const element of topics){
            if(id==element['@rid']) topic=element;
        }
        res.render("edit",{
            topics:topics,
            topic:topic
        });
    });
});

app.post("/topic/:id/edit", async function(req,res){
    const title=req.body.title;
    const desc=req.body.description;
    const author=req.body.author;
    const id=req.params.id;
    const sql=`UPDATE topic SET title="${title}", description="${desc}", author="${author}" WHERE @rid=:rid`;
    const param={
        params:{
            rid:id
        }
    }
    await query(sql, param, function(topics){
        console.log(topics);
        res.redirect("/topic/"+id);
    });
});

app.get("/topic/:id/delete", async function(req,res){
    let sql="SELECT * FROM topic";
    const id=req.params.id;
    let param="";
    await query(sql,param,function(topics){
        let topic;
        for(const element of topics){
            if(id==element['@rid']) topic=element;
        }
        res.render("delete",{
            topics:topics,
            topic:topic
        });
    });
});

app.post("/topic/:id/delete", async function(req,res){
    const id=req.params.id;
    const sql=`DELETE FROM topic WHERE @rid=:rid`;
    const param={
        params:{
            rid:id
        }
    }
    await query(sql, param, function(topics){
        console.log(topics);
        res.redirect("/topic");
    });
});

app.listen(port, function(){
    console.log(`port ${port} is connected!`);
});