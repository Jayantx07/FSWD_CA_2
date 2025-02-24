 const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publishedYear: { type: Number },
    availableCopies: { type: Number, required: true },
    borrowed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const Book = mongoose.model('Book', bookSchema);

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    borrowedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
});

const User = mongoose.model('User', userSchema);

// POST API to add a new book

app.post('/books', async (req, res) => {
    try {
        const { title, author, genre, publishedYear, availableCopies } = req.body;

        const newBook = new Book({ title, author, genre, publishedYear, availableCopies });

        await newBook.save();

        res.status(201).json(newBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// PUT API to update a book

app.put('/books/:id', async (req, res) => {
    try {
        const { title, author, genre, publishedYear, availableCopies } = req.body;

        const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, genre, publishedYear, availableCopies }, { new: true });

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(updatedBook);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// GET API to retrieve all books or a specific book by ID

app.get('/books/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json(book);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// DELETE API to delete a book


app.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        
        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }
        
        res.json(deletedBook);
        
    } catch (error) {

        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });

    }});

    // POST API to borrow a book
    app.post('/books/:id/borrow', async (req, res) => {
        try {
            const book = await Book.findById(req.params.id);
            
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
            
            if (book.availableCopies === 0) {
                return res.status(400).json({ message: 'Book out of stock' });
            }
            
            const user = await User.findById(req.body.userId);
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            if (user.borrowedBooks.includes(book.id)) {
                return res.status(400).json({ message: 'User already has this book borrowed' });
            }
            
            user.borrowedBooks.push(book.id);
            book.availableCopies--;
            
            await user.save();
            await book.save();
            
            res.json(book);
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }});
    app.listen(process.env.PORT || 5000, () => {
        console.log('Server is running on port 5000');
    });