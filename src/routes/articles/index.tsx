import { createMemo, createResource, createSignal, For, Resource } from "solid-js";
import ArticleRow from "~/components/ArticleRow"


type Article = {
    id: number;
    title: string; author: string; serial_name: string; serial_order: number; article_content: string;
}

const [page, setPage] = createSignal(1)
const articlesListURI = createMemo(() => `http://localhost:3000/articles?page=${page()}`)
const getArticles = async (): Promise<Article[]> => {
    const response = await fetch(articlesListURI());
    return await response.json() as Article[];
};


function list(articles: Resource<Article[]>, refetch: any) {
    return <>
        <ul>
            <For each={articles()}>
                {article => <li><ArticleRow article={article} /></li>}
            </For>
        </ul>
        <button onClick={() => { setPage((prev) => prev + 1); refetch() }}>next</button>
    </>
}

export default function ArticlesList() {
    const [data, { refetch }] = createResource(getArticles);
    return list(data, refetch)
}
