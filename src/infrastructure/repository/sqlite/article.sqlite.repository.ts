import { Article } from "~/core/articles/article.model";
import { ArticleReposirory, QueryParams } from "~/core/articles/article.repository";
import { QueryResult } from "~/core/dto/query-result.model";
import { Database } from '@sqlite.org/sqlite-wasm';

const ArticleColumn = 'articles.id, articles.title, articles.body, authors.name as author, books.title as book, chapters.chapter_order, articles.love, chapters.book_id, authors.id as author_id ';
const ArticleFullJoinTable = '((articles JOIN chapters ON chapters.article_id = articles.id) JOIN books ON chapters.book_id = books.id) JOIN authors ON authors.id = books.author_id WHERE articles.id';

export class ArticleSqliteRepository implements ArticleReposirory {
    #db: Database
    constructor(db: Database) {
        this.#db = db
    }

    getArticles(query: QueryParams): Promise<QueryResult<Article[]>> {
        const condition = `${query.keywords ? "WHERE body match ?" : ""}`
        const stmt = this.#db.prepare(`SELECT count(rowid) FROM articles_fts ${condition};`);

        if (query.keywords) {
            stmt.bind([`${query.keywords}`])
        }
        let total = 1
        while (stmt.step()) {
            const result = stmt.get({});
            total = Math.ceil(result["count(rowid)"] ?? 10 / query.size! -query.size!)
        }


        const articles: Article[] = [];
        const stmt2 = this.#db.prepare("SELECT rowid FROM articles_fts WHERE body like ? ORDER BY rowid DESC LIMIT ? OFFSET ?");
        stmt2.bind([`%${query.keywords}%`, query.size!, query.page! * query.size!]);
        const ids: number[] = []
        while (stmt2.step()) {
            ids.push(stmt2.get([])[0] as number);
        }

        const IdQuery = `(${"?, ".repeat(query.size! - 1)}?) `

        const stmt3 = this.#db.prepare(`SELECT ${ArticleColumn} FROM ${ArticleFullJoinTable} in ${IdQuery}`);
        stmt3.bind(ids)
        while (stmt3.step()) {
            articles.push(stmt3.get({}) as unknown as Article)
        }

        return new Promise<QueryResult<Article[]>>((resolve) => {
            resolve({
                detail: articles,
                page: total,
                size: query.size!,
                current_page: query.page!,
            })
        })

    }

    getArticle(id: number): Promise<Article> {
        const stmt = this.#db.prepare("SELECT articles.id, articles.title, articles.body, authors.name as author, books.title as book, chapters.chapter_order, articles.love, chapters.book_id, authors.id as author_id FROM ((articles JOIN chapters ON chapters.article_id = articles.id) JOIN books ON chapters.book_id = books.id) JOIN authors ON authors.id = books.author_id WHERE articles.id = ?");
        stmt.bind([id])
        stmt.step();
        const article = stmt.get({}) as unknown as Article;
        return new Promise<Article>((resolve) => {
            resolve(article)
        });
    }

    createArticle(article: Article): Promise<void> {
        const stmt = this.#db.prepare("INSERT INTO articles (title, body, author_id, book_id, chapter_order, love) VALUES (?, ?, ?, ?, ?, ?)");
        stmt.bind([article.title, article.body, article.author_id, article.book_id, article.chapter_order, String(article.love)]);
        return new Promise<void>((resolve) => {
            resolve();
        });
    }

    updateArticle(article: Article): Promise<void> {
        const stmt = this.#db.prepare("UPDATE articles SET title = ?, body = ?, author_id = ?, book_id = ?, chapter_order = ?, love = ? WHERE id = ?");
        stmt.bind([article.title, article.body, article.author_id, article.book_id, article.chapter_order, String(article.love), article.id!]);
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
