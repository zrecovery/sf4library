import { QueryResult } from "~/core/dto/query-result.model";
import { Author } from "./author.model";
import { Repository } from "../common/repository";
import { Book } from "../books/book.model";

export interface QueryParams {
  page?: number;
  size?: number;
}

export interface AuthorRepository extends Repository {
  getAuthors(query: QueryParams): Promise<QueryResult<Author[]>>;
  getAuthor(id: number): Promise<Book[]>;
}
