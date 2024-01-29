import type { ArticleReposirory } from "~/core/articles/article.repository";
import { ArticleService } from "~/core/articles/article.service";
import { AuthorService } from "~/core/authors/author.service";
import { BookService } from "~/core/books/book.service";
import type { Repository } from "~/core/common/repository";
import { SqliteRepository } from "~/infrastructure/repository/sqlite/sqlite.reposotory";

export const createRepository = <T extends Repository>(
  devRepository: T,
  prodRepository: T,
) => (process.env.NODE_ENV === "development" ? devRepository : prodRepository);
console.log(process.env.NODE_ENV);

const sqliteRepository = new SqliteRepository();
window.addEventListener("beforeunload", () => {
  sqliteRepository.close();
})
export const articleRepository: ArticleReposirory = createRepository(
  sqliteRepository,
  sqliteRepository,
);

export const bookRepository = createRepository(
  sqliteRepository,
  sqliteRepository,
);

export const authorRepository = createRepository(
  sqliteRepository,
  sqliteRepository,
);

export const articleService = new ArticleService(articleRepository);
export const bookService = new BookService(bookRepository);
export const authorService = new AuthorService(authorRepository);

const setting = async (config: object): Promise<string> => {
  const result = sqliteRepository.setting(config);
  services.articleService = new ArticleService(sqliteRepository);
  services.bookService = new BookService(sqliteRepository);
  services.authorService = new AuthorService(sqliteRepository);
  return result;
};

export const services = {
  articleService,
  bookService,
  authorService,
  setting,
};
