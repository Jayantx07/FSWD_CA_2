# FSWD_CA_2
Building a library management API with Express and MongoDB 

## Part - 1: Creating a server using Express.

- Initializing a Node.js server and install express and mongoose.
- create an Express server that listen on port 4000.
- connect the server to MongoDB using environment variables.
- use dotenv to load environment variables.

## Part - 2: Defining ann writing Mongoose Schema 

- Create a book model with the following fields: 
- title (String required) - The book title.
- author (String required) - The name of the author.
- genre (String required) - Genre of the book.(eg. Fiction, Non-Fiction).
- published Year (Number) - year of publication 
- available copies (Number required) - number of copies available in library
- borrowed (Array of Object, reference User) - list of users borrowed this book.

## Part - 3: Implementing CRUD operations

- Implementing a POST API to add a new book.
- Implementing a PUT API to update a book.
- Implementing a GET API to retrieve all books or a specific book by ID.
- Implementing a DELETE API to delete a book.

## Part - 4: Error Handling Expectations.

- missing required fields -  400 Bad request.
- invalid book or user id - 404 Not found. 
- internal server error - 500 Internal server error 