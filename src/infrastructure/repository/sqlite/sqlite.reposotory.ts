import { Article } from "~/core/articles/article.model";
import {
  ArticleReposirory,
  QueryParams,
} from "~/core/articles/article.repository";
import { Author } from "~/core/authors/author.model";
import { AuthorRepository } from "~/core/authors/author.repository";
import { Book } from "~/core/books/book.model";
import { BookRepository } from "~/core/books/book.repository";
import { QueryResult } from "~/core/dto/query-result.model";
import SqliteWorker from "./sqlite.worker.ts?worker";

const worker = new SqliteWorker();

export class SqliteRepository
  implements ArticleReposirory, AuthorRepository, BookRepository
{
  constructor() {}

  async setting(config: object): Promise<void> {
    const context = (config as { context: string }).context;
    worker.postMessage({ type: "setting", context: context });
    const onMessage = (event: { data: { type: string; result: unknown } }) => {
      console.log("setting", event.data);
    };
    worker.onmessage = onMessage;
    return Promise.resolve();
  }

  async getArticles(query: QueryParams): Promise<QueryResult<Article[]>> {
    return new Promise<QueryResult<Article[]>>((resolve) => {
      const onMessage = (event: {
        data: { type: string; result: QueryResult<Article[]> };
      }) => {
        console.log("getArticles", event.data);
        if (event.data.type === "getArticles") {
          resolve(event.data.result);
        }
      };
      worker.onmessage = onMessage;
      worker.postMessage({ type: "getArticles", query: query });
    });
  }

  getArticle(id: number): Promise<Article> {
    worker.postMessage({ type: "getArticle", id: id });
    return new Promise<Article>((resolve) => {
      worker.onmessage = (event: { data: { result: Article } }) => {
        resolve(event.data.result);
      };
    });
  }

  createArticle(article: Article): Promise<void> {
    worker.postMessage({ type: "createArticle", article: article });
    return new Promise<void>((resolve) => {
      worker.onmessage = (event: { data: void }) => {
        resolve(event.data);
      };
    });
  }

  updateArticle(article: Article): Promise<void> {
    worker.postMessage({ type: "updateArticle", article: article });
    return new Promise<void>((resolve) => {
      worker.onmessage = (event: { data: void }) => {
        resolve(event.data);
      };
    });
  }

  deleteArticle(id: number): Promise<void> {
    worker.postMessage({ type: "deleteArticle", id: id });
    return new Promise<void>((resolve) => {
      worker.onmessage = (event: { data: void }) => {
        resolve(event.data);
      };
    });
  }

  getAuthors(query: QueryParams): Promise<QueryResult<Author[]>> {
    return new Promise<QueryResult<Author[]>>((resolve) => {
      const onMessage = (event: {
        data: { type: string; result: QueryResult<Author[]> };
      }) => {
        console.log("getAuthors", event.data);
        if (event.data.type === "getAuthors") {
          resolve(event.data.result);
        }
      };
      worker.onmessage = onMessage;
      worker.postMessage({ type: "getAuthors", query: query });
    });
  }

  getAuthor(id: number): Promise<Book[]> {
    return new Promise<Book[]>((resolve) => {
      const onMessage = (event: { data: { type: string; result: Book[] } }) => {
        if (event.data.type === "getAuthor") {
          resolve(event.data.result);
        }
      };
      worker.onmessage = onMessage;
      worker.postMessage({ type: "getAuthor", id: id });
    });
  }

  getBooks(page: number, size: number): Promise<QueryResult<Book[]>> {
    return new Promise<QueryResult<Book[]>>((resolve) => {
      const onMessage = (event: {
        data: { type: string; result: QueryResult<Book[]> };
      }) => {
        if (event.data.type === "getBooks") {
          resolve(event.data.result);
        }
      };
      worker.onmessage = onMessage;
      worker.postMessage({
        type: "getBooks",
        query: { page: page, size: size },
      });
    });
  }

  getBook(
    id: number,
    page: number,
    size: number,
  ): Promise<QueryResult<Article[]>> {
    return new Promise<QueryResult<Article[]>>((resolve) => {
      const onMessage = (event: {
        data: { type: string; result: QueryResult<Article[]> };
      }) => {
        if (event.data.type === "getBook") {
          console.log(event.data);
          resolve(event.data.result);
        }
      };
      worker.onmessage = onMessage;
      worker.postMessage({
        type: "getBook",
        query: { id: id, page: page, size: size },
      });
      console.log({
        type: "getBook",
        query: { id: id, page: page, size: size },
      });
    });
  }
}
