import { createMemo, createResource, createSignal, For, Show } from "solid-js";
import { ArticleRow } from "../../components/ArticleRow";
import { Pagination } from "../../components/Pagination";
import { Article } from "../../models/article.model";
import "./index.css";
import { ServerRootUrl } from "../../environments";
import { Button, List, TextField, Switch } from "@suid/material";

export default function ArticlesList() {
  const [page, setPage] = createSignal(1);
  const [keywords, setKeywords] = createSignal("");
  const [love, setLove] = createSignal(false);

  const articlesListURI = createMemo(() => {
    let result = `${ServerRootUrl}/articles?page=${page()}`;
    if (keywords() !== "") {
      result = result.concat(`&keywords=${keywords()}`);
    }
    if (love()) {
      result = result.concat(`&love=${love()}`);
    }
    return result;
  });

  const getArticles = async (): Promise<Article[] | undefined> => {
    try {
      const response = await fetch(articlesListURI());
      return (await response.json()) as Article[];
    } catch (error) {
      console.log(error);
    }
  };

  const [data, { refetch }] = createResource(getArticles);

  return (
    <>
      <div class="grid">
        <div class="search">
          <TextField
            size="small"
            value={keywords()}
            onChange={(e) => setKeywords(e.currentTarget.value)}
          />
          <Switch checked={love()} onChange={(_, value) => setLove(value)} />
          <Button onClick={refetch}>搜索</Button>
        </div>
        <Show when={data.loading === false} fallback={<div>Loading...</div>}>
          <List>
            <For each={data()}>
              {(article) => <ArticleRow article={article} />}
            </For>
          </List>
        </Show>
        <div class="paginationbar">
          <Pagination page={page} setPage={setPage} action={refetch} />
        </div>
      </div>
    </>
  );
}
