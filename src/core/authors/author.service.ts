import type { Author } from "~/core/authors/author.model";
import type { AuthorRepository, QueryParams } from "./author.repository";
import type { QueryResult } from "~/core/dto/query-result.model";
import type { Book } from "../books/book.model";
import { Service } from "../common/service";

export class AuthorService implements Service {
  #authorRepository: AuthorRepository;
  constructor(authorRepository: AuthorRepository) {
    this.#authorRepository = authorRepository;
  }

  getAuthors(query: QueryParams): Promise<QueryResult<Author[]>> {
    return this.#authorRepository.getAuthors(query);
  }

  getAuthor(id: number): Promise<Book[]> {
    return this.#authorRepository.getAuthor(id);
  }
}
