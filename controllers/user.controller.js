const mongoose = require('mongoose')
const passport = require('passport')
const _ = require('lodash')
const mysql = require('mysql')

const User = mongoose.model('User')

var con = mysql.createConnection({
    host: 'localhost', // ip address of server running mysql
    user: 'root', // user name to your mysql database
    password: 'root',// corresponding password
    database: 'shuttle_db'
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

module.exports.register = (req, res, next) =>{
    var user = new User()
    user.firstName = req.body.firstName 
    user.lastName = req.body.lastName
    user.email = req.body.email
    user.password = req.body.password
    user.save((err, doc) => {
        if(!err){
            res.send(doc)
        }else{
            if(err.code == 11000)  
                res.status(422).send(['Duplicate email address found'])
            else
                return next(err)
        }
    })
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {
        // error from passport middleware
        if (err)
            return res.status(400).json(err)
        //registered user
        else if (user) 
            return res.status(200).json({ "token": user.generateJwt() })
        // unknown user or wrong password
        else   
            return res.status(404).json(info)
    })(req, res)
}

module.exports.userProfile = (req, res, next) => {
    User.findOne({ _id: req._id },
        (err, user) =>{
            if(!user)
                return res.status(404).json({ status: false, message: 'User record not found.'})
            else
                return res.status(200).json({ status: true, user: _.pick(user,['firstName', 'lastName', 'email'])})
        })
}


// SQL APIs -----------------------------------------------------------------------------------------------------------------------

module.exports.login = (req, res, next) =>{
    
    var email = req.body.email;
    var password = req.body.password;

    con.query(

      "SELECT * FROM passengers WHERE email = ? AND password = ?",
      [email, password], function(err, row, field){
    
        if(err){
          console.log(err);
          res.send({
            'success': false,
            'message': 'could not connect to the db'
          });
        }
    
        if(row.length > 0){
          res.send({
            'success': true,
            'passengers': row[0].email  
          });
        }

        else{
          res.send({
            'success': false,
            'message1': 'passenger not found'
          });
        }
      }
    );
}

module.exports.signUp = (req, res, next) => {
  var RegNo = req.body.regno;
  var nic = req.body.nic;
  var email = req.body.email;
  var password = req.body.Password;


    const queryString = "INSERT INTO passengers (RegNo, nic, email, password) VALUES (?,?,?,?)"
    //const QS ="SELECT * FROM customer WHERE uname = ? AND enamil = ?"

    con.query(queryString, [RegNo, nic, email, password], (err, results, fields) => {  
        
        if(results){
            res.json({
            'success': true,
            'succmessage': 'Thank You... Registation succesfull'
            });
        }

        else if(err){
            res.json({
            'success': false,
            'errmessage': 'could not connect to the db'
            });
        }
        
    })
}