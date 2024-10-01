const http = require('http');
const fs = require('fs');
const _ = require('lodash');

const server = http.createServer((req, res) => {
  // console.log(req);
  console.log(req.url); 
  // lodash
  const num = _.random(0, 20); // random number between 0 and 20
  console.log(num);

  const greet = _.once(() => { // only run once
    console.log('hello');
  });
  greet();
  greet();
  // set header content type
  res.setHeader('Content-Type', 'text/html');

  // res.write('<p>hello, ninjas</p>');
  // res.write('<p>hello again, ninjas</p>');
  // res.end();

  // send html file
  // fs.readFile('./views/index.html', (err, data) => {
  //   if (err) {
  //     console.log(err);
  //     res.end();
  //   }
  //   //res.write(data);
  //   res.end(data);
  // });

  // routing
  //status code desribles the typh of response sent to the browser
  let path = './views/';
  switch(req.url) {
    case '/':
      path += 'index.html';
      res.statusCode = 200; // 200 is the default status code
      break;
    case '/about':
      path += 'about.html';
      res.statusCode = 200;
      break;
    case '/about-us':
      res.statusCode = 301; // 301 is a permanent redirect
      res.setHeader('Location', '/about'); // redirect to /about , thay đổi url hiển thị trên trình duyệt
      res.end();
      break;
    default:
      path += '404.html';
      res.statusCode = 404; // 404 is the default status code for not found 
  }

  // send html
  fs.readFile(path, (err, data) => {
    if (err) {
      console.log(err);
      res.end();
    }
    //res.write(data);
    res.end(data);
  });


});

// localhost is the default value for 2nd argument
server.listen(3000, 'localhost', () => {
  console.log('listening for requests on port 3000');
});