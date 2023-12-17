import { Article } from "~/core/articles/article.model";
import { Book } from "~/core/books/book.model";
import { BookRepository } from "~/core/books/book.repository";
import { QueryResult } from "~/core/dto/query-result.model";



const worker = new Worker(new URL('./book.sqlite.worker.ts', import.meta.url), { type: 'module' });

export class BookSqliteRepository implements BookRepository {
    constructor() { }

    async setting(config: object): Promise<void> {
        const buffer = (config as { buffer: ArrayBuffer }).buffer;
        worker.postMessage({ type: 'setting', buffer: buffer });
        return Promise.resolve();
    }

    getBooks(page: number, size: number): Promise<QueryResult<Book[]>> {
        return new Promise<QueryResult<Book[]>>((resolve) => {
            const onMessage = (event: { data: { type: string, result: QueryResult<Book[]> } }) => {
                if (event.data.type === "getBooks") {
                    resolve(event.data.result);
                }
            };
            worker.onmessage = onMessage;
            worker.postMessage({ type: 'getBooks', query: { page: page, size: size } });
        });


    }

    getBook(id: number, page: number, size: number): Promise<QueryResult<Article[]>> {
        return new Promise<QueryResult<Article[]>>((resolve) => {
            const onMessage = (event: { data: { type: string, result: QueryResult<Article[]> } }) => {
                if (event.data.type === "getBook") {
                    console.log(event.data)
                    resolve(event.data.result);
                }
            };
            worker.onmessage = onMessage;
            worker.postMessage({ type: 'getBook', query: { id: id, page: page, size: size } });
        });

    }
}
