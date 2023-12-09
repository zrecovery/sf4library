import { ArticleReposirory } from "~/core/articles/article.repository";
import { ArticleService } from "~/core/articles/article.service";
import { AuthorService } from "~/core/authors/author.service";
import { BookService } from "~/core/books/book.service";
import { Repository } from "~/core/common/repository";
import { ArticleFetchReposirory } from "~/infrastructure/repository/fetch/article.fetch.repository";
import { AuthorFetchRepository } from "~/infrastructure/repository/fetch/author.fetch.repository";
import { BookFetchRepository } from "~/infrastructure/repository/fetch/book.fetch.repository";
import { ArticleSqliteRepository } from "~/infrastructure/repository/sqlite/article.sqlite.repository";
import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { BookSqliteRepository } from "~/infrastructure/repository/sqlite/book.sqlite.repository";
import { AuthorSqliteRepository } from "~/infrastructure/repository/sqlite/author.sqlite.repository";

const sqlite = sqlite3InitModule().then((sqlite3) => {
   return sqlite3;
});

export const createRepository = <T extends Repository>(
  devRepository: T,
  prodRepository: T,
) => (process.env.NODE_ENV === "development" ? devRepository : prodRepository);
console.log(process.env.NODE_ENV);
export const articleRepository: ArticleReposirory = createRepository(
  new ArticleSqliteRepository(await sqlite),
  new ArticleFetchReposirory(),
);

export const bookRepository = createRepository(
  new BookSqliteRepository(await sqlite),
  new BookFetchRepository(),
);

export const authorRepository = createRepository(
  new AuthorSqliteRepository(await sqlite),
  new AuthorFetchRepository(),
);

export const articleService = new ArticleService(articleRepository);
export const bookService = new BookService(bookRepository);
export const authorService = new AuthorService(authorRepository);

export const services = {
  articleService,
  bookService,
  authorService,
};
