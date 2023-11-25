import { ServerRootUrl } from "~/environments";
import { Article } from "~/models/article.model";
import { QueryResult } from "~/models/query-result.model";

interface QueryParams {
  page?: number;
  size?: number;
  keywords?: string;
  love?: boolean;
}

const objectToQueryParams = (obj: QueryParams): string => {
  const res = Object.entries(obj).filter(
    ([key, value]) => value !== "" && value !== undefined && value !== false,
  );
  return res
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
};

interface ArticleReposirory {
  getArticles(query: QueryParams): Promise<QueryResult<Article[]>>;
  getArticle(id: number): Promise<Article>;
  createArticle(article: Article): Promise<void>;
  updateArticle(article: Article): Promise<void>;
  deleteArticle(id: number): Promise<void>;
}

export class ArticleFetchReposirory implements ArticleReposirory {
  async getArticles(query: QueryParams): Promise<QueryResult<Article[]>> {
    const queryParams = objectToQueryParams(query);
    const articles = await fetch(`${ServerRootUrl}/articles?${queryParams}`);
    return (await articles.json()) as QueryResult<Article[]>;
  }
  async getArticle(id: number): Promise<Article> {
    const article = await fetch(`${ServerRootUrl}/articles/${id}`);
    return (await article.json()) as Article;
  }
  async createArticle(article: Article): Promise<void> {
    await fetch(`${ServerRootUrl}/articles`, {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });
  }

  async updateArticle(article: Article): Promise<void> {
    await fetch(`${ServerRootUrl}/articles/${article.id}`, {
      method: "Put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });
  }
  async deleteArticle(id: number): Promise<void> {
    await fetch(`${ServerRootUrl}/articles/${id}`, {
      method: "DELETE",
    });
  }
}

export class ArticleService {
  static #indstance: ArticleService;
  #repository: ArticleReposirory;
  constructor(repository: ArticleReposirory) {
    this.#repository = repository;
  }

  static single(repository: ArticleReposirory) {
    if (!ArticleService.#indstance) {
      ArticleService.#indstance = new ArticleService(repository);
    }
    return ArticleService.#indstance;
  }
  async getArticles(query: QueryParams): Promise<QueryResult<Article[]>> {
    console.log("1");
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
