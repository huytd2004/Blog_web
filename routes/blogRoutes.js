const express = require('express');
const blogController = require('../controllers/blogController');
const middlewareController = require('../controllers/middlewareController');
const router = express.Router();

router.get('/create', middlewareController.isAuthenticated,blogController.blog_create_get);
router.get('/', blogController.blog_index);
router.post('/',middlewareController.isAuthenticated,blogController.blog_create_post);
router.get('/:id', blogController.blog_details);
router.delete('/:id', blogController.blog_delete);
//search
router.post('/search', blogController.blog_search);
//Router để hiển thị form cập nhật bảng
router.get('/edit/:id', blogController.blog_edit_get);

//Router để xử lý cập nhật bảng
router.put('/edit/:id', blogController.blog_update_put); 

module.exports = router;