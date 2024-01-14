/// <reference lib="webworker" />
import sqlite3WasmInit from "@sqlite.org/sqlite-wasm";
import { LibrarySqliteRepository } from "./library.sqlite.repository";

self.onmessage = async (event) => {
    const sqlite3 = await sqlite3WasmInit();
    const db = new sqlite3.oo1.OpfsDb("file:library.db?vfs=opfs", "c");
    const librarySqliteWorker = new LibrarySqliteRepository(db);

    switch (event.data.type) {
        case "setting":
            librarySqliteWorker.setting(event.data).then((result) => {
                self.postMessage({ type: "setting", result: result });
            });
            break;
        case "getArticles":
            librarySqliteWorker.getArticles(event.data.query).then((result) => {
                self.postMessage({ type: "getArticles", result: result });
            });
            break;
        case "getArticle":
            librarySqliteWorker.getArticle(event.data.id).then((result) => {
                self.postMessage({ type: "getArticle", result: result });
            });
            break;
        case "createArticle":
            librarySqliteWorker.createArticle(event.data.article);
            break;
        case "updateArticle":
            librarySqliteWorker.updateArticle(event.data.article);
            break;
        case "deleteArticle":
            librarySqliteWorker.deleteArticle(event.data.id);
            break;
        case "getAuthors":
            librarySqliteWorker.getAuthors(event.data.query).then((result) => {
                self.postMessage({ type: "getAuthors", result: result });
            });
            break;
        case "getAuthor":
            librarySqliteWorker.getAuthor(event.data.id).then((result) => {
                self.postMessage({ type: "getAuthor", result: result });
            });
            break;
        case "getBooks":
            librarySqliteWorker
                .getBooks(event.data.query.page, event.data.query.size)
                .then((result) => {
                    self.postMessage({ type: "getBooks", result: result });
                });
            break;
        case "getBook":
            librarySqliteWorker
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
