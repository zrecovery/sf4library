import { createMemo, createResource, createSignal, For, Resource } from "solid-js";
import { ArticleRow } from "~/components/ArticleRow";
import { Pagination } from "~/components/Pagination";
import { Article } from "~/models/article.model";
import "./index.css";
import { ServerRootUrl } from "~/environments";
import { List } from "@suid/material";


const [page, setPage] = createSignal(1);
const articlesListURI = createMemo(() => `${ServerRootUrl}/articles?page=${page()}`);

const getArticles = async (): Promise<Article[]> => {
    const response = await fetch(articlesListURI());
    return await response.json() as Article[];
};


function list(articles: Resource<Article[]>, refetch: any) {
    return <>
        <div class="grid">
            <List>
                <For each={articles()}>
                    {article => <li><ArticleRow article={article} /></li>}
                </For>
            </List>
            <div class="pagination">
                <Pagination page={page} setPage={setPage} action={refetch} />
            </div>
        </div>
    </>
};

export default function ArticlesList() {
    const [data, { refetch }] = createResource(getArticles);
    return list(data, refetch)
};
