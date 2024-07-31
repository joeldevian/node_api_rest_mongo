const express = require('express');
const router = express.Router();
const Book = require('../models/book.model');

// MIDOLEWARE
const getBook = async(req, res, next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json(
            {
                message: 'El ID del libro no es válido'
            }
        )
    }

    try {
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json(
                {
                    message: 'El libro no existe'
                }
            )
        }
    } catch (error) {
        return res.status(500).json(
            {
                message: error.message
            }
        )
    }

    res.book = book;
    next();
}

// Obtener todos los libros {GET ALL}
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        console.log('GET ALL', books)
        if (books.length === 0) {
            return res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
})

// Crear un nuevo libro (recurso) {POST}
router.post('/', async (req, res) => {
    const {title, author, genre, pages, publicationDate} = req?.body
    if (!title || !author || !genre || !pages || !publicationDate) {
        return res.status(400).json({
            message: 'Los campos titulo, autor, genero, pagina y fecha son obligatorios'
        })
    }

    const book = new Book (
        {
            title,
            author,
            genre,
            pages,
            publicationDate
        }
    )

    try {
        const newBook = await book.save()
        console.log(newBook)
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

// ID
router.get('/:id', getBook, async(req, res) => {
    res.json(res.book);
})


// PUT
router.put('/:id', getBook, async(req, res) => {
    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.pages = req.body.pages || book.pages;
        book.publicationDate = req.publicationDate || book.publicationDate;

        const updateBook = await book.save()
        res.json(updateBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })

    }
})

//PACHT
router.patch('/:id', getBook, async(req, res) => {

    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.pages && !req.body.publicationDate) {
        res.status(400).json({
            message: "Al menos uno de estos campos debe ser enviado: Titulo, Autor, Género, o Fecha de publicación"
        })
    }


    try {
        const book = res.book
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.pages = req.body.pages || book.pages;
        book.publicationDate = req.publicationDate || book.publicationDate;

        const updateBook = await book.save()
        res.json(updateBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })

    }
})

// DELETE
router.delete('/:id', getBook, async(req, res) => {
    try {
        const book = res.book
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message: "Libro eliminado con éxito"
        })
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
})


module.exports = router