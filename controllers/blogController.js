const Blog = require('../models/blog');

const blog_index = (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs'});
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
  const blog = new Blog({
    ...req.body,
    username: req.session.username // Include the username of the logged-in user
  });
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
  Blog.findById(id)
    .then(blog => {
      if (blog.username === req.session.username || req.session.isAdmin) {
        return Blog.findByIdAndDelete(id);
      } else {
        res.status(403).render('404', { title: 'Unauthorized' });
        throw new Error('Unauthorized'); // Ensure the promise chain is broken
      }
    })
    .then(result => {
      res.redirect('/blogs');
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
      if (result.username === req.session.username || req.session.isAdmin) {
        res.render('edit', { blog: result, title: 'Edit Blog' });
      } else {
        res.status(403).render('404', { title: 'Unauthorized' });
      }
    })
    .catch(err => {
      res.status(404).render('404', { title: 'Blog not found' });
    });
}
//Ham xu ly put de cap nhat bai viet
const blog_update_put = (req, res) => {
  const blogId = req.params.id;
  const updatedData = {
    title: req.body.title,
    classify : req.body.classify,
    body: req.body.body
  };
  Blog.findByIdAndUpdate(blogId, updatedData, { new: true })
    .then(result => {
      res.redirect(`/blogs/${result._id}`);  // Sau khi cập nhật, chuyển hướng đến trang chi tiết blog
    })
    .catch(err => {
      res.status(500).render('404', { title: 'Error updating blog' });
    });
};
const blog_search = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const blogs = await Blog.find({ title: { $regex: searchTerm, $options: 'i' }});
    res.render("index", {
      blogs, title: 'Search Results'
    });

  } catch (error) {
    console.log(error);
  }

};


module.exports = {
  blog_index, 
  blog_details, 
  blog_create_get, 
  blog_create_post, 
  blog_delete,
  blog_edit_get,
  blog_update_put,
  blog_search
}