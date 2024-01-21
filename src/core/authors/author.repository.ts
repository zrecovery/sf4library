import type { QueryResult } from "~/core/dto/query-result.model";
import type { Author } from "./author.model";
import type { Repository } from "../common/repository";
import type { Book } from "../books/book.model";

export interface QueryParams {
  page?: number;
  size?: number;
}

export interface AuthorRepository extends Repository {
  getAuthors(query: QueryParams): Promise<QueryResult<Author[]>>;
  getAuthor(id: number): Promise<Book[]>;
}
