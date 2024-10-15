const mongoose = require('mongoose');
const Schema = mongoose.Schema; // Schema constructor 

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },                                       
    snippet: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }                              
}, { timestamps: true }); // timestamps: true để tự động thêm createdAt và updatedAt fields

const Blog = mongoose.model('Blog', blogSchema); // model('Blog', blogSchema) để tạo một model từ schema, model này sẽ tương tác với collection 'blogs' trong database,args 1 là tên model, args 2 là schema
module.exports = Blog; // export model để sử dụng ở các file khác