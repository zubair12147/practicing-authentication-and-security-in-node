const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encryp = require('mongoose-encryption');

mongoose.connect('mongodb://localhost:27017/userDB');

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        index: { unique: true },
        lowercase: true,
        // match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    password: {
        type: String,
        required: true,
    }
});
const secretString = "This is m ylittle string";
userSchema.plugin(encryp,{secret:secretString,encryptedFields:['password']});

const User = mongoose.model('User', userSchema);


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: req.body.password,
    });
    newUser.save().then(res.render('secrets')).catch((err) => {
        console.log('There is an error');
        console.log(err);
    });
});

app.post('/login',(req,res)=>{
    const userName = req.body.username;
    const password = req.body.password;

    User.find({
        email:userName,
        password: password
    }).then( res.render('secrets')).catch((err)=>{
        console.log(err);
    })
})

app.listen(3000, () => {
    console.log('server started on port: 3000');
});
