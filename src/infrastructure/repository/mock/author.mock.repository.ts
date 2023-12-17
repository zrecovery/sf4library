import { Author } from "~/core/authors/author.model";
import {
  AuthorRepository,
  QueryParams,
} from "~/core/authors/author.repository";
import { Book } from "~/core/books/book.model";
import { QueryResult } from "~/core/dto/query-result.model";
import { testAuthor, testBook } from "./test.model";

export class AuthorMockRepository implements AuthorRepository {
  setting(config: object): Promise<void> {
    console.log("no need to setting");
    return Promise.resolve();
  }
  getAuthors(query: QueryParams): Promise<QueryResult<Author[]>> {
    return new Promise<QueryResult<Author[]>>((resolve) => {
      resolve({
        detail: [testAuthor],
        page: 1,
        size: 10,
        current_page: 1,
      });
    });
  }

  getAuthor(id: number): Promise<Book[]> {
    return new Promise<Book[]>((resolve) => {
      resolve([testBook]);
    });
  }
}
