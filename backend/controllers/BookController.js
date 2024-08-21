const Book = require("../models/Book");
const Subscription = require("../models/Subscription");
const User = require("../models/User");
const { resolve } = require("url");
const path = require("path");
const mongoose = require("mongoose");

exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("category");
    const booksWithFiles = books.map((book) => ({
      ...book.toObject(),
      imageUrl: req.protocol + "://" + req.get("host") + book.image,
      pdfUrl: req.protocol + "://" + req.get("host") + book.pdf,
    }));
    res.json(booksWithFiles);
  } catch (error) {
    res.status(500).json({ message: "Error getting books" });
  }
};

exports.getFeatBooks = async (req, res) => {
  try {
    const books = await Book.find().limit(3).populate("category");
    const featBooks = books.map((book) => ({
      ...book.toObject(),
      imageUrl: req.protocol + "://" + req.get("host") + book.image,
      pdfUrl: req.protocol + "://" + req.get("host") + book.pdf,
    }));
    res.json(featBooks);
  } catch (error) {
    res.status(500).json({ message: "Error getting featured books" });
  }
};

exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("category");
    if (!book) return res.status(404).json({ message: "Book not found" });
    const bookWithFiles = {
      ...book.toObject(),
      imageUrl: req.protocol + "://" + req.get("host") + book.image,
      pdfUrl: req.protocol + "://" + req.get("host") + book.pdf,
    };
    res.json(bookWithFiles);
  } catch (error) {
    res.status(500).json({ message: "Error getting book" });
  }
};

exports.createBook = async (req, res) => {
  try {
    const data = req.body.data;
    const jsonData = JSON.parse(data);

    const uploadedImage =
      req.files && req.files["image"] ? req.files["image"][0] : null;
    const uploadedPdf =
      req.files && req.files["pdf"] ? req.files["pdf"][0] : null;

    const baseUrl = req.protocol + "://" + req.get("host") + "/uploads/";
    const imageUrl = uploadedImage
      ? resolve(baseUrl, `images/${uploadedImage.filename}`)
      : null;
    const pdfUrl = uploadedPdf
      ? resolve(baseUrl, `pdf/${uploadedPdf.filename}`)
      : null;

    if (!imageUrl || !pdfUrl) {
      return res
        .status(400)
        .json({ message: "Image and PDF files are required" });
    }

    const title = jsonData.title;
    const author = jsonData.author;
    const ISBN = jsonData.ISBN;
    const description = jsonData.description;
    const edition = jsonData.edition;
    const pages = jsonData.pages;
    const price = jsonData.price;
    const publishedYear = jsonData.publishedYear;
    const publisher = jsonData.publisher;
    const stock = jsonData.stock;
    const publish_date = jsonData.publish_date;

    const newBook = new Book({
      title,
      author,
      ISBN,
      publisher,
      publish_date,
      edition,
      pages,
      description,
      price,
      image: imageUrl,
      pdf: pdfUrl,
      category: "663336846a54b060d4c93baf",
      stock,
    });
    await newBook.save();

    res.status(200).json({
      book: newBook,
      imageUrl,
      pdfUrl,
      message: "Book created successfully",
    });
  } catch (error) {
    console.error("Error creating book:", error.message);
    res
      .status(500)
      .json({ message: "Error creating book", error: error.message });
  }
};

exports.updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      author,
      ISBN,
      publisher,
      publish_date,
      edition,
      pages,
      format,
      description,
      price,
      category,
      stock,
    } = req.body;

    const uploadedImage =
      req.files && req.files["image"] ? req.files["image"][0] : null;
    const uploadedPdf =
      req.files && req.files["pdf"] ? req.files["pdf"][0] : null;

    const baseUrl = req.protocol + "://" + req.get("host") + "/uploads/";
    const imageUrl = uploadedImage
      ? resolve(baseUrl, `images/${uploadedImage.filename}`)
      : null;
    const pdfUrl = uploadedPdf
      ? resolve(baseUrl, `pdf/${uploadedPdf.filename}`)
      : null;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      {
        title,
        author: author.split(","),
        ISBN,
        publisher,
        publish_date,
        edition,
        pages,
        format,
        description,
        price,
        image: imageUrl,
        pdf: pdfUrl,
        category: category.split(",").map((id) => mongoose.Types.ObjectId(id)),
        stock,
      },
      { new: true }
    );

    if (!updatedBook) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.status(200).json({
      book: updatedBook,
      message: "Book updated successfully",
    });
  } catch (error) {
    console.error("Error updating book:", error.message);
    res
      .status(500)
      .json({ message: "Error updating book", error: error.message });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    // find the book by its id
    const deletedBook = await Book.findByIdAndRemove(req.params.id);
    if (!deletedBook) {
      return res.status(500).json({
        message: "Book not found",
      });
    }
    // delete the book from the database
    // const deletedBook = await book.remove();
    console.log("deleted book ...");
    res.json({
      deletedBook,
      message: "Book deleted successfully",
    });
  } catch (err) {
    return res.status(500).json({
      message: err,
    });
  }
};

exports.searchBooks = (req, res) => {
  const query = req.query.q;
  Book.find(
    {
      $or: [
        { title: { $regex: query, $options: "i" } },
        { author: { $regex: query, $options: "i" } },
      ],
    },
    (err, books) => {
      if (err) {
        return res.status(500).json({
          error: err,
        });
      }
      if (!books) {
        return res.status(404).json({
          message: "No books found",
        });
      }
      res.status(200).json(books);
    }
  );
};

exports.filterBooks = (req, res) => {
  let query = {};
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.price_min && req.query.price_max) {
    query.price = { $gte: req.query.price_min, $lte: req.query.price_max };
  }

  Book.find(query, (err, books) => {
    if (err) {
      return res.status(500).json({
        error: err,
      });
    }
    if (!books) {
      return res.status(404).json({
        message: "No books found",
      });
    }
    res.status(200).json(books);
  }).populate("category");
};

exports.checkBookSubscription = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const subscription = await Subscription.findOne({ book: bookId });
    if (!subscription) {
      return res.json({ subscribed: false, message: "Book is not subscribed" });
    }

    const subscribedUsers = await User.find({
      _id: { $in: subscription.users },
    });
    res.json({ subscribed: true, subscribedUsers });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking book subscription", error });
  }
};

exports.subscribeToBook = async (req, res) => {
  try {
    const userId = req.body.userId;
    const bookId = req.body.bookId;
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const subscription = await Subscription.findOne({ book: bookId });
    if (subscription && subscription.users.includes(userId)) {
      return res
        .status(400)
        .json({ message: "User is already subscribed to this book" });
    }
    if (!subscription) {
      const newSubscription = new Subscription({
        book: bookId,
        users: [userId],
      });
      await newSubscription.save();
    } else {
      subscription.users.push(userId);
      await subscription.save();
    }

    res
      .status(200)
      .json({ message: "User subscribed to the book successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error subscribing user to the book", error });
  }
};
