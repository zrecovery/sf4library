import type { Article } from "~/core/articles/article.model";
import type {
  ArticleReposirory,
  QueryParams,
} from "~/core/articles/article.repository";
import type { Author } from "~/core/authors/author.model";
import type { AuthorRepository } from "~/core/authors/author.repository";
import type { Book } from "~/core/books/book.model";
import type { BookRepository } from "~/core/books/book.repository";
import type { QueryResult } from "~/core/dto/query-result.model";
import { sqlite3Worker1Promiser } from "@sqlite.org/sqlite-wasm";
import type {
  ErrType,
  ExecResultType,
  MsgType,
  OpenResultType,
  PostMessage,
} from "./type";

const ArticleColumn =
  "articles.id, articles.title, articles.body, authors.name as author, books.title as book, chapters.chapter_order, articles.love, chapters.book_id, authors.id as author_id ";
const ArticleFullJoinTable =
  "((articles JOIN chapters ON chapters.article_id = articles.id) JOIN books ON chapters.book_id = books.id) JOIN authors ON authors.id = books.author_id ";

const promiser: <T>(config: PostMessage) => Promise<MsgType<T>> =
  await new Promise((resolve) => {
    const _promiser = sqlite3Worker1Promiser({
      onready: () => {
        resolve(_promiser);
      },
    });
  });

export class SqliteRepository
  implements ArticleReposirory, AuthorRepository, BookRepository
{
  #promiser: <T>(config: PostMessage) => Promise<MsgType<T>>;
  #dbId?: string;
  constructor() {
    this.#promiser = promiser;
    this.#init({ filename: "library.db" });
  }

  async #init(config: { filename: string }): Promise<string> {
    try {
      const msg: MsgType<OpenResultType> = await this.#promiser({
        type: "open",
        args: {
          filename: config.filename ?? "library.db",
          vfs: "opfs",
        },
      });
      this.#dbId = msg.result.dbId;
      return "初始化成功";
    } catch (e) {
      if (!(e instanceof Error)) {
        const result = (e as ErrType).result;
        throw new Error(result.message);
      } else {
        throw e;
      }
    }
  }

  #input = async (context: string): Promise<string> => {
    try {
      const msg: MsgType<ExecResultType> = await this.#promiser({
        type: "exec",
        dbId: this.#dbId,
        args: { sql: context },
      });
      console.log(msg);
      return "输入成功";
    } catch (e) {
      if (!(e instanceof Error)) {
        const result = (e as ErrType).result;
        throw new Error(result.message);
      } else {
        throw e;
      }
    }
  };

  async setting(config: { op: string; context?: string }): Promise<string> {
    let result = "";
    switch (config.op) {
      case "file":
        if (config.context) {
          return this.#input(config.context);
        }
        break;
      default:
        result = `${config.op}操作失败`;
        break;
    }
    return result;
  }

  getArticles = async (query: QueryParams): Promise<QueryResult<Article[]>> => {
    const condition = `${query.keywords ? "WHERE body match ?" : ""}`;

    const stmt: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: `SELECT count(rowid) FROM articles_fts ${condition};`,
        returnValue: "resultRows",
        rowMode: "object",
        bind: [`${query.keywords}`],
      },
    });
    let total = 1;

    const result = stmt.result.resultRows[0] as Record<string, string>;
    total = Math.ceil(
      Number(result["count(rowid)"]) ?? 10 / query.size! - query.size!,
    );

    const stmt2: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: "SELECT rowid FROM articles_fts WHERE body like ? ORDER BY rowid DESC LIMIT ? OFFSET ?",
        returnValue: "resultRows",
        rowMode: "array",
        bind: [`%${query.keywords}%`, query.size!, query.page! * query.size!],
      },
    });
    const ids = (stmt2.result.resultRows as number[][]).flatMap((item) => item);

    const IdQuery = `(${"?, ".repeat(query.size! - 1)}?) `;

    const stmt3: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: `SELECT ${ArticleColumn} FROM ${ArticleFullJoinTable} WHERE articles.id in ${IdQuery}`,
        returnValue: "resultRows",
        rowMode: "object",
        bind: ids,
      },
    });

    const articles = stmt3.result.resultRows as Article[];

    return {
      detail: articles,
      page: total,
      size: query.size!,
      current_page: query.page!,
    };
  };

  getArticle = async (id: number): Promise<Article> => {
    const stmt: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: `SELECT ${ArticleColumn} FROM ${ArticleFullJoinTable} WHERE articles.id = ?`,
        returnValue: "resultRows",
        rowMode: "object",
        bind: [id],
      },
    });
    const article = stmt.result.resultRows[0] as Article;
    return article;
  };

  createArticle = async (article: Article): Promise<void> => {
    await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: "INSERT INTO articles (title, body, author_id, book_id, chapter_order, love) VALUES (?, ?, ?, ?, ?, ?)",
        returnValue: "resultRows",
        rowMode: "object",
        bind: [
          article.title,
          article.body,
          article.author_id,
          article.book_id,
          article.chapter_order,
          String(article.love),
        ],
      },
    });
  };

  updateArticle = async (article: Article): Promise<void> => {
    await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: "UPDATE articles SET title = ?, body = ?, author_id = ?, book_id = ?, chapter_order = ?, love = ? WHERE id = ?",
        returnValue: "resultRows",
        rowMode: "object",
        bind: [
          article.title,
          article.body,
          article.author_id,
          article.book_id,
          article.chapter_order,
          String(article.love),
          article.id!,
        ],
      },
    });
  };

  deleteArticle = async (id: number): Promise<void> => {
    await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: "DELETE FROM articles WHERE id = ?",
        returnValue: "resultRows",
        rowMode: "object",
        bind: [id],
      },
    });
  };

  getAuthors = async (query: QueryParams): Promise<QueryResult<Author[]>> => {
    const stmt1: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: "SELECT count(id) FROM authors",
        returnValue: "resultRows",
        rowMode: "object",
      },
    });
    const stmt1Result: ExecResultType = stmt1.result;
    const total = Math.ceil(
      Number(
        (stmt1Result.resultRows[0] as Record<string, string>)["count(id)"],
      ) / query.size!,
    );

    const stmt2: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: "SELECT id, name FROM authors LIMIT ? OFFSET ?",
        bind: [query.size!, query.page! * query.size! - query.size!],
        returnValue: "resultRows",
        rowMode: "object",
      },
    });
    const authors = stmt2.result.resultRows as Author[];
    return {
      detail: authors,
      page: total,
      size: query.size!,
      current_page: query.page!,
    };
  };

  getAuthor = async (id: number): Promise<Book[]> => {
    const stmt: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      args: {
        sql: "SELECT * FROM books WHERE author_id = ?",
        bind: [id],
        returnValue: "resultRows",
        rowMode: "object",
      },
    });

    const books = stmt.result.resultRows as Book[];
    return books;
  };

  getBooks = async (
    page: number,
    size: number,
  ): Promise<QueryResult<Book[]>> => {
    const stmt1: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: "SELECT count(id) FROM books",
        returnValue: "resultRows",
        rowMode: "object",
      },
    });
    const total = Math.ceil(
      Number(
        (stmt1.result.resultRows[0] as Record<string, string>)["count(id)"],
      ) / size,
    );
    const stmt: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: `SELECT id, title FROM books LIMIT ? OFFSET ?`,
        bind: [size, page * size - size],
        returnValue: "resultRows",
        rowMode: "object",
      },
    });

    const books = stmt.result.resultRows as Book[];
    return {
      detail: books,
      page: total,
      size: size,
      current_page: page,
    };
  };

  getBook = async (
    id: number,
    page: number,
    size: number,
  ): Promise<QueryResult<Article[]>> => {
    const stmt1: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: "SELECT count(id) FROM chapters WHERE book_id = ?",
        returnValue: "resultRows",
        rowMode: "object",
        bind: [id],
      },
    });

    const total = Math.ceil(
      Number(
        (stmt1.result.resultRows[0] as Record<string, string>)["count(id)"],
      ) / size,
    );
    const stmt: MsgType<ExecResultType> = await this.#promiser({
      type: "exec",
      dbId: this.#dbId,
      args: {
        sql: `SELECT ${ArticleColumn} FROM ${ArticleFullJoinTable} WHERE chapters.book_id = ? LIMIT ? OFFSET ?`,
        bind: [id, size, page * size - size],
        returnValue: "resultRows",
        rowMode: "object",
      },
    });

    const articles = stmt.result.resultRows as Article[];

    return {
      detail: articles,
      page: total,
      size: size,
      current_page: page,
    };
  };
}
