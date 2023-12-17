/// <reference lib="webworker" />
import { Article } from "~/core/articles/article.model";
import {
  ArticleReposirory,
  QueryParams,
} from "~/core/articles/article.repository";
import { QueryResult } from "~/core/dto/query-result.model";
import sqlite3WasmInit, { OpfsDatabase } from "@sqlite.org/sqlite-wasm";

const ArticleColumn =
  "articles.id, articles.title, articles.body, authors.name as author, books.title as book, chapters.chapter_order, articles.love, chapters.book_id, authors.id as author_id ";
const ArticleFullJoinTable =
  "((articles JOIN chapters ON chapters.article_id = articles.id) JOIN books ON chapters.book_id = books.id) JOIN authors ON authors.id = books.author_id WHERE articles.id";

export class ArticleSqliteRepository implements ArticleReposirory {
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

  getArticles(query: QueryParams): Promise<QueryResult<Article[]>> {
    const condition = `${query.keywords ? "WHERE body match ?" : ""}`;
    const stmt = this.#db.prepare(
      `SELECT count(rowid) FROM articles_fts ${condition};`,
    );

    if (query.keywords) {
      stmt.bind([`${query.keywords}`]);
    }
    let total = 1;
    while (stmt.step()) {
      const result = stmt.get({});
      total = Math.ceil(
        Number(result["count(rowid)"]) ?? 10 / query.size! - query.size!,
      );
    }

    const articles: Article[] = [];
    const stmt2 = this.#db.prepare(
      "SELECT rowid FROM articles_fts WHERE body like ? ORDER BY rowid DESC LIMIT ? OFFSET ?",
    );
    stmt2.bind([`%${query.keywords}%`, query.size!, query.page! * query.size!]);
    const ids: number[] = [];
    while (stmt2.step()) {
      ids.push(stmt2.get([])[0] as number);
    }
    const IdQuery = `(${"?, ".repeat(query.size! - 1)}?) `;

    const stmt3 = this.#db.prepare(
      `SELECT ${ArticleColumn} FROM ${ArticleFullJoinTable} in ${IdQuery}`,
    );
    stmt3.bind(ids);
    while (stmt3.step()) {
      articles.push(stmt3.get({}) as unknown as Article);
    }

    return new Promise<QueryResult<Article[]>>((resolve) => {
      resolve({
        detail: articles,
        page: total,
        size: query.size!,
        current_page: query.page!,
      });
    });
  }

  getArticle(id: number): Promise<Article> {
    const stmt = this.#db.prepare(
      "SELECT articles.id, articles.title, articles.body, authors.name as author, books.title as book, chapters.chapter_order, articles.love, chapters.book_id, authors.id as author_id FROM ((articles JOIN chapters ON chapters.article_id = articles.id) JOIN books ON chapters.book_id = books.id) JOIN authors ON authors.id = books.author_id WHERE articles.id = ?",
    );
    stmt.bind([id]);
    stmt.step();
    const article = stmt.get({}) as unknown as Article;
    return new Promise<Article>((resolve) => {
      resolve(article);
    });
  }

  createArticle(article: Article): Promise<void> {
    const stmt = this.#db.prepare(
      "INSERT INTO articles (title, body, author_id, book_id, chapter_order, love) VALUES (?, ?, ?, ?, ?, ?)",
    );
    stmt.bind([
      article.title,
      article.body,
      article.author_id,
      article.book_id,
      article.chapter_order,
      String(article.love),
    ]);
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  updateArticle(article: Article): Promise<void> {
    const stmt = this.#db.prepare(
      "UPDATE articles SET title = ?, body = ?, author_id = ?, book_id = ?, chapter_order = ?, love = ? WHERE id = ?",
    );
    stmt.bind([
      article.title,
      article.body,
      article.author_id,
      article.book_id,
      article.chapter_order,
      String(article.love),
      article.id!,
    ]);
    stmt.step();
    return new Promise<void>((resolve) => {
      resolve();
    });
  }

  deleteArticle(id: number): Promise<void> {
    const stmt = this.#db.prepare("DELETE FROM articles WHERE id = ?");
    stmt.bind([id]);
    stmt.step();
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
}

const sqlite3 = await sqlite3WasmInit();
const db = new sqlite3.oo1.OpfsDb("test.db", "ct");
const articleSqliteWorker = new ArticleSqliteRepository(db);
self.onmessage = async (event) => {
  switch (event.data.type) {
    case "setting":
      articleSqliteWorker.setting(event.data);
      break;
    case "getArticles":
      articleSqliteWorker.getArticles(event.data.query).then((result) => {
        self.postMessage({ type: "getArticles", result: result });
      });
      break;
    case "getArticle":
      articleSqliteWorker.getArticle(event.data.id).then((result) => {
        self.postMessage({ type: "getArticle", result: result });
      });
      break;
    case "createArticle":
      articleSqliteWorker.createArticle(event.data.article);
      break;
    case "updateArticle":
      articleSqliteWorker.updateArticle(event.data.article);
      break;
    case "deleteArticle":
      articleSqliteWorker.deleteArticle(event.data.id);
      break;
    default:
      self.postMessage({ type: "error", message: "Unknown message type" });
  }
};
