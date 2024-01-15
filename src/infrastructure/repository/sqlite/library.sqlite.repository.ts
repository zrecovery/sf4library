import { Article } from "~/core/articles/article.model";
import {
  ArticleReposirory,
  QueryParams,
} from "~/core/articles/article.repository";
import { QueryResult } from "~/core/dto/query-result.model";
import sqlite3Wasm, { OpfsDatabase } from "@sqlite.org/sqlite-wasm";
import { AuthorRepository } from "~/core/authors/author.repository";
import { Author } from "~/core/authors/author.model";
import { Book } from "~/core/books/book.model";
import { BookRepository } from "~/core/books/book.repository";

const ArticleColumn =
  "articles.id, articles.title, articles.body, authors.name as author, books.title as book, chapters.chapter_order, articles.love, chapters.book_id, authors.id as author_id ";
const ArticleFullJoinTable =
  "((articles JOIN chapters ON chapters.article_id = articles.id) JOIN books ON chapters.book_id = books.id) JOIN authors ON authors.id = books.author_id ";

export class LibrarySqliteRepository
  implements ArticleReposirory, AuthorRepository, BookRepository
{
  #db: OpfsDatabase;
  constructor(db: OpfsDatabase) {
    this.#db = db;
  }

  async setting(config: object): Promise<string> {
    const context = (config as { context: string }).context;
    const op = (config as { op: string }).op;

    // 删除OPFS目录下全部文件，并重新创建新数据库文件.
    const init = async () => {
      const deleteAllFiles = async function () {
        const direct = await navigator.storage.getDirectory();
        for await (const [name] of direct)
          await direct.removeEntry(name, { recursive: true });
      };
      await deleteAllFiles();
      const sqlite3 = await sqlite3Wasm();
      this.#db = new sqlite3.oo1.OpfsDb("library.db", "c");
      return "Init success";
    };

    // 导入SQL文件.
    const inputSqlFile = (ctx: string) => {
      this.#db.exec(ctx);
      return "Input success";
    };

    // 生成索引.
    const createFtsIndex = () => {
      this.#db.exec(
        "CREATE VIRTUAL TABLE articles_fts USING fts5(title, body,love UNINDEXED, content='articles', content_rowid='id');",
      );
      this.#db.exec(
        "INSERT INTO articles_fts(rowid, title, body, love) SELECT id, title, body, love FROM articles;",
      );
      return "Input success";
    };

    switch (op) {
      case "init":
        return init();
      case "file":
        return inputSqlFile(context);
      case "finish":
        return createFtsIndex();
      default:
        throw new Error(`超出设计的操作: ${op}`);
    }
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
      `SELECT ${ArticleColumn} FROM ${ArticleFullJoinTable} WHERE articles.id in ${IdQuery}`,
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

  getAuthors(query: QueryParams): Promise<QueryResult<Author[]>> {
    const stmt1 = this.#db.prepare("SELECT count(id) FROM authors");
    stmt1.step();
    const total = Math.ceil(Number(stmt1.get({})["count(id)"]) / query.size!);
    const stmt2 = this.#db.prepare(
      "SELECT id, name FROM authors LIMIT ? OFFSET ?",
    );
    stmt2.bind([query.size!, query.page! * query.size! - query.size!]);
    const authors: Author[] = [];
    while (stmt2.step()) {
      authors.push(stmt2.get({}) as unknown as Author);
    }
    return new Promise<QueryResult<Author[]>>((resolve) => {
      resolve({
        detail: authors,
        page: total,
        size: query.size!,
        current_page: query.page!,
      });
    });
  }

  getAuthor(id: number): Promise<Book[]> {
    const stmt = this.#db.prepare("SELECT * FROM books WHERE author_id = ?");
    stmt.bind([id]);
    const books: Book[] = [];
    while (stmt.step()) {
      books.push(stmt.get({}) as unknown as Book);
    }
    return new Promise<Book[]>((resolve) => {
      resolve(books);
    });
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
