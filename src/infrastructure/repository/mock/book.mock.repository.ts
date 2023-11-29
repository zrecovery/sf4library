import { Article } from "~/core/articles/article.model";
import { Book } from "~/core/books/book.model";
import { QueryResult } from "~/core/dto/query-result.model";
import { testArticle, testBook } from "./test.model";

export class BookMockRepository {
  getBooks(page: number, size: number): Promise<QueryResult<Book[]>> {
    return new Promise<QueryResult<Book[]>>((resolve) => {
      resolve({
        detail: [testBook],
        page: 1,
        size: 10,
        current_page: 1,
      });
    });
  }
  getBook(
    id: number,
    page: number,
    size: number,
  ): Promise<QueryResult<Article[]>> {
    return new Promise<QueryResult<Article[]>>((resolve) => {
      resolve({
        detail: [testArticle],
        page: 1,
        size: 10,
        current_page: 1,
      });
    });
  }
}
