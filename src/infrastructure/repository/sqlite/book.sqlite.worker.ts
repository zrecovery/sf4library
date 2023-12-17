/// <reference lib="webworker" />
import sqlite3WasmInit, { OpfsDatabase } from "@sqlite.org/sqlite-wasm";
import { Article } from "~/core/articles/article.model";
import { Book } from "~/core/books/book.model";
import { BookRepository } from "~/core/books/book.repository";
import { QueryResult } from "~/core/dto/query-result.model";

const ArticleColumn =
  "articles.id, articles.title, articles.body, authors.name as author, books.title as book, chapters.chapter_order, articles.love, chapters.book_id, authors.id as author_id ";
const ArticleFullJoinTable =
  "((chapters JOIN books ON chapters.book_id = books.id) JOIN articles ON chapters.article_id = articles.id) JOIN authors ON authors.id = books.author_id ";

export class BookSqliteRepository implements BookRepository {
  #db: OpfsDatabase;
  constructor(db: OpfsDatabase) {
    this.#db = db;
  }

  async setting(config: object): Promise<void> {
    const buffer = (config as { buffer: ArrayBuffer }).buffer;
    const sqlite3 = await sqlite3WasmInit();
    const resultCode = await sqlite3.oo1.OpfsDb.importDb("test.db", buffer);
    this.#db = this.#db.checkRc(resultCode);
    return Promise.resolve();
  }

  getBooks(page: number, size: number): Promise<QueryResult<Book[]>> {
    const stmt1 = this.#db.prepare("SELECT count(id) FROM books");
    stmt1.step();
    const total = Math.ceil(Number(stmt1.get({})["count(id)"]) / size);
    const stmt = this.#db.prepare(
      "SELECT id, title FROM books LIMIT ? OFFSET ?",
    );
    stmt.bind([size, page * size - size]);
    const books: Book[] = [];
    while (stmt.step()) {
      books.push(stmt.get({}) as unknown as Book);
    }
    return new Promise<QueryResult<Book[]>>((resolve) => {
      resolve({
        detail: books,
        page: total,
        size: size,
        current_page: page,
      });
    });
  }

  getBook(
    id: number,
    page: number,
    size: number,
  ): Promise<QueryResult<Article[]>> {
    const stmt1 = this.#db.prepare(
      "SELECT count(id) FROM chapters WHERE book_id = ?",
    );
    stmt1.bind([id]);
    stmt1.step();
    const total = Math.ceil(Number(stmt1.get({})["count(id)"]) / size);
    const stmt = this.#db.prepare(
      `SELECT ${ArticleColumn} FROM ${ArticleFullJoinTable} WHERE chapters.book_id = ? LIMIT ? OFFSET ?`,
    );
    stmt.bind([id, size, page * size - size]);
    const articles: Article[] = [];
    while (stmt.step()) {
      articles.push(stmt.get({}) as unknown as Article);
    }
    return new Promise<QueryResult<Article[]>>((resolve) => {
      resolve({
        detail: articles,
        page: total,
        size: size,
        current_page: page,
      });
    });
  }
}
const sqlite3 = await sqlite3WasmInit();
const db = new sqlite3.oo1.OpfsDb("test.db", "ct");
const bookSqliteWorker = new BookSqliteRepository(db);
self.onmessage = async (event) => {
  switch (event.data.type) {
    case "setting":
      bookSqliteWorker.setting(event.data);
      break;
    case "getBooks":
      bookSqliteWorker
        .getBooks(event.data.query.page, event.data.query.size)
        .then((result) => {
          self.postMessage({ type: "getBooks", result: result });
        });
      break;
    case "getBook":
      bookSqliteWorker
        .getBook(
          event.data.query.id,
          event.data.query.page,
          event.data.query.size,
        )
        .then((result) => {
          self.postMessage({ type: "getBook", result: result });
        });
      break;
    default:
      self.postMessage({ type: "error", message: "Unknown message type" });
  }
};
