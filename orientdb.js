const configData=require("./config.js");
const username=configData.username;
const password=configData.password;
const db=configData.db;
const OrientDBClient = require("orientjs").OrientDBClient;

function query(sql,param="",callback){
    OrientDBClient.connect({
        host: "localhost",
        port: configData.port
      }).then(client => {
          client.session({name:db,username:username,password:password})
          .then(session => {
              session.command(sql,param)
              .all()
              .then((results) => {
                  //console.log(results);
                  callback(results);
                  console.log('End of the stream');
                  session.close().then(()=>{
                      return client.close();
                  });
              })
          }).then(()=> {
              console.log("Client closed");
          })
    });
}

module.exports=query;
 

