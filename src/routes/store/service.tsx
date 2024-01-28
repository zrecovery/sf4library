import { createContext, useContext } from "solid-js";
import { ArticleService } from "~/core/articles/article.service";
import { AuthorService } from "~/core/authors/author.service";
import { BookService } from "~/core/books/book.service";

interface ContextService {
  articleService: ArticleService;
  bookService: BookService;
  authorService: AuthorService;
  setting: (config: object) => Promise<string>;
}
export const ServiceContext = createContext<ContextService>();

export function useService() {
  return useContext(ServiceContext);
}
