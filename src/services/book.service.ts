import { ServerRootUrl } from "~/environments";
import { Article } from "~/models/article.model";
import { Book } from "~/models/book.model";
import { QueryResult } from "~/models/query-result.model";

export interface BookRepository {
  getBooks(page: number, size: number): Promise<QueryResult<Book[]>>;
  getBook(
    id: number,
    page: number,
    size: number,
  ): Promise<QueryResult<Article[]>>;
}

export class BookFetchRepository implements BookRepository {
  async getBooks(page: number, size: number): Promise<QueryResult<Book[]>> {
    return fetch(`${ServerRootUrl}/books?page=${page}&size=${size}`).then(
      (response) => response.json(),
    );
  }
  async getBook(
    id: number,
    page: number,
    size: number,
  ): Promise<QueryResult<Article[]>> {
    return fetch(`${ServerRootUrl}/books/${id}?page=${page}&size=${size}`).then(
      (response) => response.json(),
    );
  }
}

export class BookService {
  static #instance: BookService;
  #bookRepository: BookRepository;

  constructor(repository: BookRepository) {
    this.#bookRepository = repository;
  }

  static single(repository: BookRepository) {
    if (!BookService.#instance) {
      BookService.#instance = new BookService(repository);
    }
    return BookService.#instance;
  }

  public getBooks = async (
    page: number,
    size: number,
  ): Promise<QueryResult<Book[]>> => {
    return this.#bookRepository.getBooks(page, size);
  };

  public getBook(
    id: number,
    page: number,
    size: number,
  ): Promise<QueryResult<Article[]>> {
    return this.#bookRepository.getBook(id, page, size);
  }
}
