import { Article } from "~/core/articles/article.model";
import { Book } from "~/core/books/book.model";
import { BookRepository } from "./book.repository";
import { QueryResult } from "~/core/dto/query-result.model";
import { Service } from "../common/service";

export class BookService implements Service {
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
