const mongoose = require('mongoose')
const mysql = require('mysql')


var con = mysql.createConnection({
    host: '127.0.0.1', // ip address of server running mysql
    port: 3306,
    user: 'root', // user name to your mysql database
    password: 'root',// corresponding password
    schema: 'shuttle_db'
    //insecureAuth : true,
  });

  con.connect(function(err) {
    if(!err){
        console.log('SQL db connection succeeded..!')
    } else{
        console.log('jkwsnns')
        console.log('Error in DB connection : ' + JSON.stringify(err, undefined, 2))
    }
  });
require('./user.model')  
