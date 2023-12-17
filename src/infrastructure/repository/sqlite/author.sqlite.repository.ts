import { Author } from "~/core/authors/author.model";
import {
  AuthorRepository,
  QueryParams,
} from "~/core/authors/author.repository";
import { Book } from "~/core/books/book.model";
import { QueryResult } from "~/core/dto/query-result.model";

const worker = new Worker(
  new URL("./author.sqlite.worker.ts", import.meta.url),
  { type: "module" },
);

export class AuthorSqliteRepository implements AuthorRepository {
  constructor() {}

  async setting(config: object): Promise<void> {
    const buffer = (config as { buffer: ArrayBuffer }).buffer;
    worker.postMessage({ type: "setting", buffer: buffer });
    return Promise.resolve();
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
}
