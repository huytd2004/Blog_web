const Blog = require('../models/blog');

const blog_index = (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_details = (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      res.status(404).render('404', { title: 'Blog not found'});
    });
}

const blog_create_get = (req, res) => {
  res.render('create', { title: 'Create a new blog' });
}

const blog_create_post = (req, res) => {
  const blog = new Blog(req.body);
  // console.log(req.body);
  // console.log(blog);
  blog.save() 
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
}

const blog_delete = (req, res) => {
  const id = req.params.id;
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
      // res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
}
//Ham xu ly get de hien thi form cap nhat bai viet
const blog_edit_get = (req, res) => {
  const id = req.params.id; 
  Blog.findById(id)
  .then(result => {
    res.render('edit', { blog: result, title: 'Edit Blog' });
  })
  .catch(err => {
    res.status(404).render('404', { title: 'Blog not found'});
  });
}
//Ham xu ly put de cap nhat bai viet
const blog_update_put = (req, res) => {
  const blogId = req.params.id;
  const updatedData = {
    title: req.body.title,
    snippet : req.body.snippet,
    body: req.body.body
  };

  console.log(updatedData);

  Blog.findByIdAndUpdate(blogId, updatedData, { new: true })
    .then(result => {
      res.redirect(`/blogs/${result._id}`);  // Sau khi cập nhật, chuyển hướng đến trang chi tiết blog
    })
    .catch(err => {
      res.status(500).render('404', { title: 'Error updating blog' });
    });
};

module.exports = {
  blog_index, 
  blog_details, 
  blog_create_get, 
  blog_create_post, 
  blog_delete,
  blog_edit_get,
  blog_update_put
}