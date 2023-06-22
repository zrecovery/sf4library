import { createResource, For, Resource, Show } from "solid-js";
import ArticleRow from "~/components/ArticleRow"


type Article = { id: number; title: string; author: string; serial_name: string; serial_order: number; article_content: string; }

const getArticles = async () => {
  const response = await fetch("http://localhost:3000/articles");
  return await response.json() as Article[];
};

export function routeData() {
  return createResource(async () => {
    const response = await fetch("http://localhost:3000/articles");
    return await response.json() as Article[];
  });
}

function list(articles: Resource<Article[]>) {
  return <Show when={!articles.loading} fallback={<>Searching...</>}>
    <ul>
      <For each={articles()}>
        {article => <li><ArticleRow article={article} /></li>}
      </For>
    </ul>
  </Show >
}

export default function ArticlesList() {
  const [data] = createResource(getArticles);
  return list(data)
}
