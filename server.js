// Part 1: Setting up the Express Server

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// Connecting to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB Connection Failed:', err));

// Part 2: Defining Mongoose Schema

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publishedYear: { type: Number },
    availableCopies: { type: Number, required: true },
    borrowed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Book = mongoose.model('Book', bookSchema);

// Part 3: CRUD Operations

// Create a new book
app.post('/books', async (req, res) => {
    try {
        const { title, author, genre, publishedYear, availableCopies } = req.body;
        if (!title || !author || !genre || availableCopies === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const newBook = new Book({ title, author, genre, publishedYear, availableCopies });
        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Retrieve all books or a specific book by ID
app.get('/books/:id?', async (req, res) => {
    try {
        if (req.params.id) {
            const book = await Book.findById(req.params.id);
            if (!book) return res.status(404).json({ error: 'Book not found' });
            return res.json(book);
        }
        const books = await Book.find();
        res.json(books);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update a book
app.put('/books/:id', async (req, res) => {
    try {
        const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedBook) return res.status(404).json({ error: 'Book not found' });
        res.json(updatedBook);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);
        if (!deletedBook) return res.status(404).json({ error: 'Book not found' });
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Starting the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));