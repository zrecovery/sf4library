import { Article } from "~/core/articles/article.model";
import { Book } from "~/core/books/book.model";
import { BookRepository } from "~/core/books/book.repository";
import { Config } from "~/infrastructure/config";
import { QueryResult } from "~/core/dto/query-result.model";

export class BookFetchRepository implements BookRepository {
  async getBooks(page: number, size: number): Promise<QueryResult<Book[]>> {
    return fetch(
      `${Config.ServerRootUrl}/books?page=${page}&size=${size}`,
    ).then((response) => response.json());
  }
  async getBook(
    id: number,
    page: number,
    size: number,
  ): Promise<QueryResult<Article[]>> {
    return fetch(
      `${Config.ServerRootUrl}/books/${id}?page=${page}&size=${size}`,
    ).then((response) => response.json());
  }
}
