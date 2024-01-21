import type { QueryResult } from "~/core/dto/query-result.model";
import type { Article } from "../articles/article.model";
import type { Book } from "./book.model";
import type { Repository } from "../common/repository";

export interface BookRepository extends Repository {
  getBooks(page: number, size: number): Promise<QueryResult<Book[]>>;
  getBook(
    id: number,
    page: number,
    size: number,
  ): Promise<QueryResult<Article[]>>;
}
