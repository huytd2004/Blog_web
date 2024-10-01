const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const methodOverride = require('method-override');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = 'mongodb+srv://huytran:conghuy5d@nodetutorial.qqtlk.mongodb.net/node-tuts?retryWrites=true&w=majority&appName=NodeTutorial';

mongoose.connect(dbURI)
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); //xu ly du lieu tu form
app.use(methodOverride('_method')); // Sử dụng method-override để hỗ trợ PUT và DELETE
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => { //đối số 1 là đường dẫn 
  res.render('about', { title: 'About' });
});

// blog routes
app.use('/blogs', blogRoutes);

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});