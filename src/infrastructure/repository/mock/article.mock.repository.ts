import { Article } from "~/core/articles/article.model";
import {
  ArticleReposirory,
  QueryParams,
} from "~/core/articles/article.repository";
import { QueryResult } from "~/core/dto/query-result.model";
import { testArticle } from "./test.model";

export class ArticleMockRepository implements ArticleReposirory {
  getArticles(query: QueryParams): Promise<QueryResult<Article[]>> {
    const articles: Article[] = [testArticle];
    return new Promise<QueryResult<Article[]>>((resolve) => {
      resolve({
        detail: articles,
        page: 1,
        size: 10,
        current_page: 1,
      });
    });
  }
  getArticle(id: number): Promise<Article> {
    return new Promise<Article>((resolve) => {
      resolve(testArticle);
    });
  }
  createArticle(article: Article): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
  updateArticle(article: Article): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
  deleteArticle(id: number): Promise<void> {
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
}
