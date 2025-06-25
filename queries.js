// Task 2:

// books by specific genre
db.books.find({ genre: "Fiction" });

// books published after a certain year
db.books.find({ published_year: { $gt: 1950 } });

// books by a specific author
db.books.find({ author: "George Orwell" });

// updates the price of a specific book
db.books.updateOne({ title: "1984" }, { $set: { price: 15.99 } });

// deletes a book by its title
db.books.deleteOne({ title: "Moby Dick" });

// Task 3:

// find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } });

// uses projection to return only title, author and price
db.books.find({}, { projection: { title: 1, author: 1, price: 1, _id: 0 } });

// sort books by price in ascending order
db.books.find().sort({ price: 1 });

// sort books by price in descending order
db.books.find().sort({ price: -1 });

// pagination
const page = 3;
const limit = 5;
const skip = (page - 1) * limit;

db.books.find().skip(skip).limit(limit);

// Task 4:

// calculates the average price of books by genre
db.books.aggregate([
	{
		$group: {
			_id: "$genre",
			averagePrice: { $avg: "$price" },
			totalBooks: { $sum: 1 },
		},
	},
]);

//   finds the author with the most books in the collection
db.books.aggregate([
	{ $group: { _id: "$author", count: { $sum: 1 } } },
	{ $sort: { count: -1 } },
	{ $limit: 1 },
]);

//   groups books by publication decade and counts them
db.books.aggregate([
	{
		$addFields: {
			decade: {
				$subtract: [
					"$published_year",
					{ $mod: ["$published_year", 10] },
				],
			},
		},
	},
	{
		$group: {
			_id: "$decade",
			count: { $sum: 1 },
			books: { $push: "$title" },
		},
	},
	{ $sort: { _id: 1 } },
]);

//   Task 5:

// creates an index on the title field
db.books.createIndex({ title: 1 });

// creates a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: -1 });

// demonstrates the performance improvement
db.books.dropIndexes();
db.books.find({ title: "1984" }).explain("executionStats");

// with index
db.books.createIndex({ title: 1 });
db.books.find({ title: "1984" }).explain("executionStats");
