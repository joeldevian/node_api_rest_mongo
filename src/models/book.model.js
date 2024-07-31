const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
    {
        title: String,
        author: String,
        genre: String,
        pages: String,
        publicationDate: String
    }
)

module.exports = mongoose.model('Book', bookSchema);