import { Article } from "~/core/articles/article.model";
import {
  ArticleReposirory,
  QueryParams,
} from "~/core/articles/article.repository";
import { QueryResult } from "~/core/dto/query-result.model";
import { Config } from "~/infrastructure/config";
import { objectToQueryParams } from "~/utils/query-params.util";

export class ArticleFetchReposirory implements ArticleReposirory {
  async getArticles(query: QueryParams): Promise<QueryResult<Article[]>> {
    const queryParams = objectToQueryParams(query);
    const response = await fetch(
      `${Config.ServerRootUrl}/articles?${queryParams}`,
    );
    const articles = await response.json();
    return articles as QueryResult<Article[]>;
  }
  async getArticle(id: number): Promise<Article> {
    const response = await fetch(`${Config.ServerRootUrl}/articles/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch article");
    }
    return response.json() as Promise<Article>;
  }
  async createArticle(article: Article): Promise<void> {
    const response = await fetch(`${Config.ServerRootUrl}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      throw new Error("Failed to create article");
    }
  }

  updateArticle = async (article: Article): Promise<void> => {
    const response = await fetch(
      `${Config.ServerRootUrl}/articles/${article.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(article),
      },
    );

    if (!response.ok) {
      throw new Error("Failed to update article");
    }
  };
  async deleteArticle(id: number): Promise<void> {
    const response = await fetch(`${Config.ServerRootUrl}/articles/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete article");
    }
  }
}
