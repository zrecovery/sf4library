import { Author } from "~/models/author.model";
import { QueryResult } from "~/models/query-result.model";

interface QueryParams {
  page?: number;
  size?: number;
}

interface AuthorRepository {
  getAuthors(query: QueryParams): Promise<QueryResult<Author[]>>;
}

export class AuthorService {
  #authorRepository: AuthorRepository;
  constructor(authorRepository: AuthorRepository) {
    this.#authorRepository = authorRepository;
  }

  getAuthors(query: QueryParams): Promise<QueryResult<Author[]>> {
    return this.#authorRepository.getAuthors(query);
  }
}
