const express = require("express");
const initializeDatabase = require("./db");

const app = express();

app.use(express.json());

let db;

const initializeDBAndServer = async () => {
  try {
    db = await initializeDatabase();

    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// GET ALL BOOKS
app.get("/books/", async (request, response) => {
  const books = await db.all("SELECT * FROM book");
  response.send(books);
});

// GET ONE BOOK
app.get("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const book = await db.get(
    "SELECT * FROM book WHERE id = ?",
    [bookId]
  );

  if (book === undefined) {
    response.status(404).send("Book Not Found");
  } else {
    response.send(book);
  }
});

// ADD A BOOK
app.post("/books/", async (request, response) => {
  const { title, author, price, pages } = request.body;

  const query = `
    INSERT INTO book (title, author, price, pages)
    VALUES (?, ?, ?, ?)
  `;

  await db.run(query, [title, author, price, pages]);

  response.status(201).send("Book Added Successfully");
});

// UPDATE A BOOK
app.put("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;
  const { title, author, price, pages } = request.body;

  const query = `
    UPDATE book
    SET title = ?, author = ?, price = ?, pages = ?
    WHERE id = ?
  `;

  const result = await db.run(
    query,
    [title, author, price, pages, bookId]
  );

  if (result.changes === 0) {
    response.status(404).send("Book Not Found");
  } else {
    response.send("Book Updated Successfully");
  }
});

// DELETE A BOOK
app.delete("/books/:bookId/", async (request, response) => {
  const { bookId } = request.params;

  const result = await db.run(
    "DELETE FROM book WHERE id = ?",
    [bookId]
  );

  if (result.changes === 0) {
    response.status(404).send("Book Not Found");
  } else {
    response.send("Book Deleted Successfully");
  }
});

module.exports = app;
