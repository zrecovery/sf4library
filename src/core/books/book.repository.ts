import { QueryResult } from "~/core/dto/query-result.model";
import { Article } from "../articles/article.model";
import { Book } from "./book.model";
import { Repository } from "../common/repository";

export interface BookRepository extends Repository {
  getBooks(page: number, size: number): Promise<QueryResult<Book[]>>;
  getBook(
    id: number,
    page: number,
    size: number,
  ): Promise<QueryResult<Article[]>>;
}
