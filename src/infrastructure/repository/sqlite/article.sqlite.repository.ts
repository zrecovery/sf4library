import { Article } from "~/core/articles/article.model";
import { ArticleReposirory, QueryParams } from "~/core/articles/article.repository";
import { QueryResult } from "~/core/dto/query-result.model";


const worker = new Worker(new URL('./article.sqlite.worker.ts', import.meta.url), { type: 'module' });

export class ArticleSqliteRepository implements ArticleReposirory {

    constructor() {}

    async getArticles(query: QueryParams): Promise<QueryResult<Article[]>> {
        return new Promise<QueryResult<Article[]>>((resolve) => {
            const onMessage = (event: { data: { type: string, result: QueryResult<Article[]> } }) => {
                console.log("getArticles", event.data)
                if (event.data.type === "getArticles") {
                    resolve(event.data.result);
                }
            };
            worker.onmessage = onMessage;
            worker.postMessage({ type: 'getArticles', query: query });
        });
    }

    getArticle(id: number): Promise<Article> {
        worker.postMessage({ type: 'getArticle', id: id });
        return new Promise<Article>((resolve) => {
            worker.onmessage = (event: { data: Article }) => {
                resolve(event.data)
            }
        })
    }

    createArticle(article: Article): Promise<void> {
        worker.postMessage({ type: 'createArticle', article: article });
        return new Promise<void>((resolve) => {
            worker.onmessage = (event: { data: void }) => {
                resolve(event.data)
            }
        })
    }

    updateArticle(article: Article): Promise<void> {
        worker.postMessage({ type: 'updateArticle', article: article });
        return new Promise<void>((resolve) => {
            worker.onmessage = (event: { data: void }) => {
                resolve(event.data)
            }
        })
    }

    deleteArticle(id: number): Promise<void> {
        worker.postMessage({ type: 'deleteArticle', id: id });
        return new Promise<void>((resolve) => {
            worker.onmessage = (event: { data: void }) => {
                resolve(event.data)
            }
        })

    }

}
