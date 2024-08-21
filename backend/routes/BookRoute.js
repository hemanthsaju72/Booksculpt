const express = require('express');
const router = express.Router();
const { uploadFilesMiddleware, handleFileUploadErrors } = require('../middleware/fileUpload.js');
const { getBooks, getBook, createBook, updateBook, deleteBook, searchBooks, filterBooks, getFeatBooks, checkBookSubscription } = require("../controllers/BookController");
const { adminAuth } = require("../middleware/auth.js");


router.get("/books", getBooks);

router.get("/book/:id", getBook);

router.get("/featbooks", getFeatBooks);

router.post('/books', uploadFilesMiddleware, handleFileUploadErrors, createBook);

router.put('/books/:id', uploadFilesMiddleware, handleFileUploadErrors, updateBook);

router.delete("/books/:id",adminAuth , deleteBook);

router.get("/books/search",searchBooks);

router.get("/books/filter",filterBooks);

router.get('/books/:id/subscription', checkBookSubscription);


module.exports = router;