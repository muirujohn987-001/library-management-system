import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create the four book genres.
  const genres = [
    {
      name: "Fiction",
      description: "Novels and imaginative stories.",
    },
    {
      name: "Science",
      description: "Books about scientific discoveries and principles.",
    },
    {
      name: "Technology",
      description: "Books about computing and modern technology.",
    },
    {
      name: "History",
      description: "Books about historical events and people.",
    },
  ];

  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { name: genre.name },
      update: { description: genre.description },
      create: genre,
    });
  }

  // Retrieve the genres so we can associate books with them.
  const fiction = await prisma.genre.findUniqueOrThrow({
    where: { name: "Fiction" },
  });

  const science = await prisma.genre.findUniqueOrThrow({
    where: { name: "Science" },
  });

  const technology = await prisma.genre.findUniqueOrThrow({
    where: { name: "Technology" },
  });

  const history = await prisma.genre.findUniqueOrThrow({
    where: { name: "History" },
  });

  // Create 16 books distributed across the four genres.
  const books = [
    {
      title: "Things Fall Apart",
      author: "Chinua Achebe",
      isbn: "9780385474542",
      publishedYear: 1958,
      genreId: fiction.id,
    },
    {
      title: "The River Between",
      author: "Ngugi wa Thiong'o",
      isbn: "9780435905484",
      publishedYear: 1965,
      genreId: fiction.id,
    },
    {
      title: "Animal Farm",
      author: "George Orwell",
      isbn: "9780451526342",
      publishedYear: 1945,
      genreId: fiction.id,
    },
    {
      title: "1984",
      author: "George Orwell",
      isbn: "9780451524935",
      publishedYear: 1949,
      genreId: fiction.id,
    },
    {
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      isbn: "9780743273565",
      publishedYear: 1925,
      genreId: fiction.id,
    }
,
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      isbn: "9780553380163",
      publishedYear: 1988,
      genreId: science.id,
    },
    {
      title: "The Selfish Gene",
      author: "Richard Dawkins",
      isbn: "9780198788607",
      publishedYear: 1976,
      genreId: science.id,
    },
    {
      title: "Cosmos",
      author: "Carl Sagan",
      isbn: "9780345539434",
      publishedYear: 1980,
      genreId: science.id,
    },
    {
      title: "The Origin of Species",
      author: "Charles Darwin",
      isbn: "9781509827695",
      publishedYear: 1859,
      genreId: science.id,
    },
    {
      title: "The Gene",
      author: "Siddhartha Mukherjee",
      isbn: "9781476733500",
      publishedYear: 2016,
      genreId: science.id,
    },
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      isbn: "9780132350884",
      publishedYear: 2008,
      genreId: technology.id,
    },
    {
      title: "The Pragmatic Programmer",
      author: "David Thomas and Andrew Hunt",
      isbn: "9780135957059",
      publishedYear: 2019,
      genreId: technology.id,
    },
    {
      title: "Introduction to Algorithms",
      author: "Thomas H. Cormen",
      isbn: "9780262046305",
      publishedYear: 2022,
      genreId: technology.id,
    },
    {
      title: "The Art of Computer Programming",
      author: "Donald Knuth",
      isbn: "9780201896831",
      publishedYear: 1997,
      genreId: technology.id,
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      isbn: "9780062316097",
      publishedYear: 2015,
      genreId: history.id,
    },
    {
      title: "Long Walk to Freedom",
      author: "Nelson Mandela",
      isbn: "9780316548182",
      publishedYear: 1994,
      genreId: history.id,
    },
  ];

  for (const book of books) {
    await prisma.book.upsert({
      where: { isbn: book.isbn },
      update: book,
      create: book,
    });
  }

  console.log("Database seeding completed successfully!");
  console.log(`Genres processed: ${genres.length}`);
  console.log(`Books processed: ${books.length}`);
}

main()
  .catch((error) => {
    console.error("Error while seeding database:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

