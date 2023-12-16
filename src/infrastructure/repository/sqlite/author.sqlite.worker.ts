/// <reference lib="webworker" />
import { Database } from "@sqlite.org/sqlite-wasm";
import { Author } from "~/core/authors/author.model";
import { AuthorRepository, QueryParams } from "~/core/authors/author.repository";
import { Book } from "~/core/books/book.model";
import { QueryResult } from "~/core/dto/query-result.model";

export class AuthorSqliteRepository implements AuthorRepository {
    constructor(db: Database) {
        this.#db = db
    }

    getAuthors(query: QueryParams): Promise<QueryResult<Author[]>> {
        const stmt1 = this.#db.prepare('SELECT count(id) FROM authors');
        stmt1.step();
        const total = Math.ceil(Number(stmt1.get({})['count(id)']) / query.size!);
        const stmt2 = this.#db.prepare('SELECT id, name FROM authors LIMIT ? OFFSET ?')
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
                current_page: query.page!
            })
        })
    }

    getAuthor(id: number): Promise<Book[]> {
        const stmt = this.#db.prepare('SELECT * FROM books WHERE author_id = ?');
        stmt.bind([id]);
        const books: Book[] = [];
        while (stmt.step()) {
            books.push(stmt.get({}) as unknown as Book);
        }
        return new Promise<Book[]>((resolve) => {
            resolve(books)
        })
    }

}
