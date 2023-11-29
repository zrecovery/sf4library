import { createEffect, createSignal, For, Show } from "solid-js";
import { ArticleRow } from "~/components/ArticleRow";
import { Pagination } from "~/components/Pagination";
import { Article } from "~/core/articles/article.model";
import "./index.css";
import { Button, List, TextField, Switch } from "@suid/material";
import { QueryResult } from "~/core/dto/query-result.model";
import { useService } from "../store/service";

export default function ArticlesList() {
  const [page, setPage] = createSignal(1);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [keywords, setKeywords] = createSignal("");
  const [searchkeywords, setSearchKeywords] = createSignal("");
  const [love, setLove] = createSignal(false);

  const [data, setData] = createSignal<QueryResult<Article[]>>();
  const services = useService();

  createEffect(async () => {
    const response = await services?.articleService.getArticles({
      page: currentPage(),
      size: 10,
      keywords: searchkeywords(),
      love: love(),
    });
    setData(response);
    setPage(response?.page ?? 1);
  });

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
          <Button onClick={() => setSearchKeywords(keywords())}>搜索</Button>
        </div>
        <Show when={data()} fallback={<div>Loading...</div>}>
          <List>
            <For each={data()?.detail}>
              {(article) => <ArticleRow article={article} />}
            </For>
          </List>
          <div class="paginationbar">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPage={page}
            />
          </div>
        </Show>
      </div>
    </>
  );
}
