import type { Article } from "~/core/articles/article.model";
import type { QueryResult } from "~/core/dto/query-result.model";
import type { Repository } from "../common/repository";

export interface QueryParams {
  page?: number;
  size?: number;
  keywords?: string;
  love?: boolean;
}

export interface ArticleReposirory extends Repository {
  getArticles(query: QueryParams): Promise<QueryResult<Article[]>>;
  getArticle(id: number): Promise<Article>;
  createArticle(article: Article): Promise<void>;
  updateArticle(article: Article): Promise<void>;
  deleteArticle(id: number): Promise<void>;
}
