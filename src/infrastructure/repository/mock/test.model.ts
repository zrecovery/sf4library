import { Article } from "~/core/articles/article.model";
import { Author } from "~/core/authors/author.model";
import { Book } from "~/core/books/book.model";

export const testArticle: Article = {
  id: 1,
  title: "title",
  body: "content",
  author: "author",
  book: "book",
  chapter_order: 1.0,
  love: true,
  book_id: 1,
  author_id: 1,
};

export const testBook: Book = {
  id: 1,
  title: "test book title",
  author: "test author",
};

export const testAuthor: Author = {
  id: 1,
  name: "test author",
};
