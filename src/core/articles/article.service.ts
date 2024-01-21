import type { Article } from "~/core/articles/article.model";
import type { QueryResult } from "~/core/dto/query-result.model";
import type { ArticleReposirory, QueryParams } from "./article.repository";
import { Service } from "../common/service";

export class ArticleService implements Service {
  static #indstance: ArticleService;
  #repository: ArticleReposirory;
  constructor(repository: ArticleReposirory) {
    this.#repository = repository;
  }

  async getArticles(query: QueryParams): Promise<QueryResult<Article[]>> {
    return this.#repository.getArticles(query);
  }

  async getArticle(id: number): Promise<Article> {
    return this.#repository.getArticle(id);
  }

  async createArticle(article: Article): Promise<void> {
    return this.#repository.createArticle(article);
  }

  async updateArticle(article: Article): Promise<void> {
    return this.#repository.updateArticle(article);
  }

  async deleteArticle(id: number): Promise<void> {
    return this.#repository.deleteArticle(id);
  }
}
