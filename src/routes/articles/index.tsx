import { createEffect, createSignal, For, Show } from "solid-js";
import { ArticleRow } from "~/components/ArticleRow";
import { Pagination } from "~/components/Pagination";
import { Article } from "~/core/articles/article.model";
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
      size: 4,
      keywords: searchkeywords(),
      love: love(),
    });
    setData(response);
    setPage(response?.page ?? 1);
  });

  return (
    <>
      <div class="grid grid-rows-9 h-full">
        <div class="grid-row-start-1 grid-row-end-2">
          <TextField
            size="small"
            value={keywords()}
            onChange={(e) => setKeywords(e.currentTarget.value)}
          />
          <Switch checked={love()} onChange={(_, value) => setLove(value)} />
          <Button onClick={() => setSearchKeywords(keywords())}>搜索</Button>
        </div>
        <Show when={data()} fallback={<div>Loading...</div>}>
          <div class="grid-row-start-2 grid-row-end-8">
            <List>
              <For each={data()?.detail}>
                {(article) => <ArticleRow article={article} />}
              </For>
            </List>
          </div>
          <div class="grid-row-start-9 grid-row-end-10">
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
