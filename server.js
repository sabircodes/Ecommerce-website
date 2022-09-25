if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
  }
  
  const express = require('express')
  const app = express()
  const bcrypt = require('bcrypt')
  const passport = require('passport')
  const flash = require('express-flash')
  const session = require('express-session')
  const methodOverride = require('method-override')
  
  const initializePassport = require('./passport-config')
  initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
  )
  
  const users = []
  
  app.set('view-engine', 'ejs')
  app.use(express.urlencoded({ extended: false }))
  app.use(flash())
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  }))
  app.use(passport.initialize())
  app.use(passport.session())
  app.use(methodOverride('_method'))
  app.use(express.static("public"));
  
  app.get('/checkout', checkAuthenticated, (req, res) => {
    res.render('checkout.ejs', { name: req.user.name })
  })
    
  app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
  })
  
  app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/checkout',
    failureRedirect: '/login',
    failureFlash: true
  }))
  
  app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
  })
  
  app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10)
      users.push({
        id: Date.now().toString(),
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      })
      res.redirect('/login')
    } catch {
      res.redirect('/register')
    }
  })
  
  app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
    console.log(users)
  })
  
  function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }
  
app.get('/', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('index.ejs');
})
app.get('/shop', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('shop.ejs');
})
app.get('/blog', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('blog.ejs');
})
app.get('/contact', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('contact.ejs');
})
app.get('/login', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('indexlogin.ejs');
})
app.get('/product', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('product.ejs');
})
app.get('/product1', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('product1.ejs');
})
app.get('/productv', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('productv.ejs');
})
app.get('/productv2', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('productv2.ejs');
})
app.get('/product4', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('product4.ejs');
})
app.get('/checkout', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('checkout.ejs');
})
app.get('/men', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('mens.ejs');
})
app.get('/women', (req, res) => {
    // res.send("Hey sabir server is running ")
    res.render('women.ejs');
})
  
  app.listen(3000 , function(){
    console.log('server started')
  })




 