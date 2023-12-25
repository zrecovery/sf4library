import { ArticleReposirory } from "~/core/articles/article.repository";
import { ArticleService } from "~/core/articles/article.service";
import { AuthorService } from "~/core/authors/author.service";
import { BookService } from "~/core/books/book.service";
import { Repository } from "~/core/common/repository";
import { ArticleFetchReposirory } from "~/infrastructure/repository/fetch/article.fetch.repository";
import { AuthorFetchRepository } from "~/infrastructure/repository/fetch/author.fetch.repository";
import { BookFetchRepository } from "~/infrastructure/repository/fetch/book.fetch.repository";
import { SqliteRepository } from "~/infrastructure/repository/sqlite/sqlite.reposotory";

export const createRepository = <T extends Repository>(
  devRepository: T,
  prodRepository: T,
) => (process.env.NODE_ENV === "development" ? devRepository : prodRepository);
console.log(process.env.NODE_ENV);

const sqliteRepository = new SqliteRepository();

export const articleRepository: ArticleReposirory = createRepository(
  sqliteRepository,
  new ArticleFetchReposirory(),
);

export const bookRepository = createRepository(
  sqliteRepository,
  new BookFetchRepository(),
);

export const authorRepository = createRepository(
  sqliteRepository,
  new AuthorFetchRepository(),
);

export const articleService = new ArticleService(articleRepository);
export const bookService = new BookService(bookRepository);
export const authorService = new AuthorService(authorRepository);

const setting = async (config: object): Promise<void> => {
  articleRepository.setting(config);
  bookRepository.setting(config);
  authorRepository.setting(config);
  services.articleService = new ArticleService(articleRepository);
  services.bookService = new BookService(bookRepository);
  services.authorService = new AuthorService(authorRepository);
};

export const services = {
  articleService,
  bookService,
  authorService,
  setting,
};
