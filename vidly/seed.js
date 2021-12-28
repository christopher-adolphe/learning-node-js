const { Genre } = require("./models/genre");
const { Movie } = require("./models/movie");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Comedy",
    movies: [
      { title: "Airplane", amountInStock: 5, dailyRentalRate: 2 },
      { title: "The Hangover", amountInStock: 10, dailyRentalRate: 2 },
      { title: "Wedding Crashers", amountInStock: 15, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Action",
    movies: [
      { title: "Die Hard", amountInStock: 5, dailyRentalRate: 2 },
      { title: "Terminator", amountInStock: 10, dailyRentalRate: 2 },
      { title: "The Avengers", amountInStock: 15, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Romance",
    movies: [
      { title: "The Notebook", amountInStock: 5, dailyRentalRate: 2 },
      { title: "When Harry Met Sally", amountInStock: 10, dailyRentalRate: 2 },
      { title: "Pretty Woman", amountInStock: 15, dailyRentalRate: 2 }
    ]
  },
  {
    name: "Thriller",
    movies: [
      { title: "The Sixth Sense", amountInStock: 5, dailyRentalRate: 2 },
      { title: "Gone Girl", amountInStock: 10, dailyRentalRate: 2 },
      { title: "The Others", amountInStock: 15, dailyRentalRate: 2 }
    ]
  }
];

async function seed() {
  const db = config.get('db');
  await mongoose.connect(db, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  });

  await Movie.deleteMany({});
  await Genre.deleteMany({});

  for (let genre of data) {
    const { _id: genreId } = await new Genre({ name: genre.name }).save();
    const movies = genre.movies.map(movie => ({
      ...movie,
      genre: { _id: genreId, name: genre.name }
    }));
    await Movie.insertMany(movies);
  }

  mongoose.disconnect();

  console.info("Done!");
}

seed();
