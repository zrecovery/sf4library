import { ArticleReposirory } from "~/core/articles/article.repository";
import { ArticleService } from "~/core/articles/article.service";
import { AuthorService } from "~/core/authors/author.service";
import { BookService } from "~/core/books/book.service";
import { Repository } from "~/core/common/repository";
import { ArticleFetchReposirory } from "~/infrastructure/repository/fetch/article.fetch.repository";
import { AuthorFetchRepository } from "~/infrastructure/repository/fetch/author.fetch.repository";
import { BookFetchRepository } from "~/infrastructure/repository/fetch/book.fetch.repository";
import { ArticleSqliteRepository } from "~/infrastructure/repository/sqlite/article.sqlite.repository";
import { BookMockRepository } from "~/infrastructure/repository/mock/book.mock.repository";
import { AuthorMockRepository } from "~/infrastructure/repository/mock/author.mock.repository";


export const createRepository = <T extends Repository>(
  devRepository: T,
  prodRepository: T,
) => (process.env.NODE_ENV === "development" ? devRepository : prodRepository);
console.log(process.env.NODE_ENV);
export const articleRepository: ArticleReposirory = createRepository(
  new ArticleSqliteRepository(),
  new ArticleFetchReposirory(),
);

export const bookRepository = createRepository(
  new BookMockRepository(),
  new BookFetchRepository(),
);

export const authorRepository = createRepository(
  new AuthorMockRepository(),
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
