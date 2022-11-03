const express = require('express')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
let port = process.env.PORT
if(port == null || port == "") {
  port = 5000
}

app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect('mongodb+srv://admin:Test123@cluster0.gw99yck.mongodb.net/atgDB', { useNewUrlParser: true })

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String
})

const User = mongoose.model('User', userSchema)

let users = ['admin']
let titles = ['Eiffel Tower']
let descs = ['The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. Locally nicknamed "La dame de fer", it was constructed from 1887 to 1889 as the centerpiece of the 1889 World\'s Fair.']

app.post('/', (req, res) => {
  let _user = req.body._user
  let title = req.body.title
  let desc = req.body.desc
  users.push(_user)
  titles.push(title)
  descs.push(desc)
  res.render('index', {users: users, titles: titles, descs: descs})
})


app.post('/signup-success', (req, res) => {
  let username = req.body.username
  let name = req.body.name
  let email = req.body.email
  let pwd = req.body.pwd
  let cnfpwd = req.body.cnfpwd


  if (pwd != cnfpwd) {
    res.render('signup-success', {text: 'Passwords do not match!'})
  }

  const user = new User({
    username: username,
    name: name,
    email: email,
    password: pwd
  })

  user.save()

  res.render('signup-success', {text: 'Signup Successful!'})
})

app.post('/logout', (req, res) => {
  res.render('signup-success', {text: 'Logout Successful!'})
})

app.post('/login-success', (req, res) => {
  let username = req.body.username
  let pwd = req.body.pwd

  User.find((err, users) => {
    if (err) {
      console.log(err)
    } else {
      let flag = true
      users.forEach((user) => {
        if (username === user.username && pwd === user.password) {
          flag = false
          res.render('user-dashboard', {name: user.name, username: user.username})
        }
      })
      if (flag) {
        res.render('signup-success', {text: 'Login Failure'})
      }
    }
  })
})

app.post('/reset-pwd', (req, res) => {
  let username = req.body.username
  let newpwd = req.body.pwd
  let newcnfpwd = req.body.cnfpwd

  if (newpwd !== newcnfpwd) {
    res.render('signup-success', {text: 'Passwords do not match!'})
  } else {
    User.updateOne({ username: username }, { password: newpwd }, (err) => {
      if (err) {
        console.log(err)
      } else {
        res.render('signup-success', {text: 'Password update successful'})
      }
    })
  }

})

app.get('/', (req, res) => {
  res.render('index', {users: users, titles: titles, descs: descs})
})

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html')
})

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html')
})

app.get('/resetpwd', (req, res) => {
  res.sendFile(__dirname + '/public/resetpwd.html')
})

app.listen(port, () => {
  console.log('Server is listening')
})