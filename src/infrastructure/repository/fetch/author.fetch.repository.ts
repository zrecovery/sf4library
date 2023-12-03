import { Author } from "~/core/authors/author.model";
import {
  AuthorRepository,
  QueryParams,
} from "~/core/authors/author.repository";
import { Book } from "~/core/books/book.model";
import { Config } from "~/infrastructure/config";
import { QueryResult } from "~/core/dto/query-result.model";
import { objectToQueryParams } from "~/utils/query-params.util";

export class AuthorFetchRepository implements AuthorRepository {
  async getAuthor(id: number): Promise<Book[]> {
    const response = await fetch(`${Config.ServerRootUrl}/authors/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch author");
    }
    return response.json<Book[]>();
  }
  async getAuthors(query: QueryParams): Promise<QueryResult<Author[]>> {
    const queryParams = objectToQueryParams(query);
    const response = await fetch(
      `${Config.ServerRootUrl}/authors?${queryParams}`,
    );
    if (!response.ok) {
      throw new Error("Failed to fetch authors");
    }
    return response.json<QueryResult<Author[]>>();
  }
}
