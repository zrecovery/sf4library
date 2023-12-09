import { Title } from "solid-start";
import sqlite3InitModule, { Sqlite3Static } from '@sqlite.org/sqlite-wasm';
import { ArticleService } from "~/core/articles/article.service";
import { ArticleSqliteRepository } from "~/infrastructure/repository/sqlite/article.sqlite.repository";
import { useService } from "./store/service";
import { BookSqliteRepository } from "~/infrastructure/repository/sqlite/book.sqlite.repository";
import { BookService } from "~/core/books/book.service";
import { AuthorSqliteRepository } from "~/infrastructure/repository/sqlite/author.sqlite.repository";
import { AuthorService } from "~/core/authors/author.service";

export default function Home() {
    const services = useService();

    function start(sqlite3: Sqlite3Static, arrayBuffer: ArrayBuffer) {
        // assuming arrayBuffer contains the result of the above operation...
        const p = sqlite3.wasm.allocFromTypedArray(arrayBuffer);
        const db = new sqlite3.oo1.DB();
        const rc = sqlite3.capi.sqlite3_deserialize(
            db.pointer, 'main', p, arrayBuffer.byteLength, arrayBuffer.byteLength,
            sqlite3.capi.SQLITE_DESERIALIZE_FREEONCLOSE
            // Optionally:
            // | sqlite3.capi.SQLITE_DESERIALIZE_RESIZEABLE
        );
        const newdb = db.checkRc(rc);
        const articleRepository = new ArticleSqliteRepository(newdb);
        const articleService = new ArticleService(articleRepository);
        services!.articleService = articleService;
        const bookRepository = new BookSqliteRepository(newdb);
        const bookService = new BookService(bookRepository);
        services!.bookService = bookService;
        const authorRepository = new AuthorSqliteRepository(newdb);
        const authorService = new AuthorService(authorRepository);
        services!.authorService = authorService;


    }

    let eUploadDb: HTMLInputElement;
    const inp = () => {
        const f = eUploadDb.files[0];
        if (!f) return;
        const r: FileReader = new FileReader();
        r.readAsArrayBuffer(f);

        r.addEventListener('loadend', () => {
            sqlite3InitModule().then((sqlite3) => { start(sqlite3, r.result) });
        })


    }

    return (
        <main>
            <Title>欢迎</Title>
            <h1>Hello World2</h1>
            <input ref={eUploadDb} type='file' id='load-db' />
            <button onClick={inp}>upload</button>
        </main>
    );
}
