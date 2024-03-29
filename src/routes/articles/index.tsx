import { createMemo, createSignal, For, Show, type Accessor, createResource } from "solid-js";
import { ArticleRow } from "~/components/ArticleRow";
import { Pagination } from "~/components/Pagination";
import { Button, List, TextField, Switch } from "@suid/material";
import { useService } from "../store/service";
import type { QueryParams } from "~/core/articles/article.repository";

export default function ArticlesList() {
  const [page, setPage] = createSignal(1);
  const [currentPage, setCurrentPage] = createSignal(1);
  const [keywords, setKeywords] = createSignal("");
  const [searchkeywords, setSearchKeywords] = createSignal("");
  const [love, setLove] = createSignal(false);

  const services = useService();

  const fetchParams: Accessor<QueryParams> = createMemo(() => {
    return {
      page: currentPage(),
      size: 4,
      keywords: searchkeywords(),
      love: love(),
    }
  })

  const fetchData = async (params: QueryParams) => {
    if (!services) {
      throw new Error("Service not found");
    }

    const result = await services?.articleService.getArticles(params);
    setPage(result?.page ?? 1);
    return result;

  }
  const [data] = createResource(fetchParams, fetchData)

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
        <Show when={searchkeywords() !== ""}>
          <Show when={!data.loading} fallback={<div>Loading...</div>}>
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
        </Show>
      </div>
    </>
  );
}
