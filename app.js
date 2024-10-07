const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blogRoutes');
const methodOverride = require('method-override');
const Blog = require('./models/blog');
const dotenv = require('dotenv'); 
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
// express app
const app = express();

// connect to mongodb & listen for requests
dotenv.config(); // doc file .env
const dbURI = process.env.MONGODB_URL; // lay gia tri cua MONGODB_URL trong file .env

mongoose.connect(dbURI)
  .then(result => app.listen(3000))
  .catch(err => console.log(err));
// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(cors()); //cho phep truy cap tu cac domain khac nhau
app.use(cookieParser()); //doc cookie
app.use(express.json()); //Sau khi express.json() xử lý, dữ liệu JSON được chuyển vào thuộc tính req.body của đối tượng request, và bạn có thể dễ dàng truy cập và xử lý dữ liệu này.

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

app.get('/about', (req, res) => { 
  res.render('about', { title: 'About' });
});

// blog routes
app.use('/blogs', blogRoutes);

//auth routes
app.use('/auth', authRoutes);
//user routes
app.use('/user',userRoutes);

// 404 page
// app.use((req, res) => {
//   res.status(404).render('404', { title: '404' });
// });


