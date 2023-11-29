import { List } from "@suid/material";
import {
  createEffect,
  createResource,
  createSignal,
  For,
  Resource,
  Show,
} from "solid-js";
import ArticleRow from "../../components/ArticleRow";
import { useParams } from "solid-start";
import { Article } from "~/core/articles/article.model";
import { Pagination } from "~/components/Pagination";

import { useService } from "../store/service";

export default function BookDetail() {
  const services = useService();
  const [articles, setArticles] = createSignal<Array<Article>>([
    {
      title: "",
      author: "",
      book: "",
      chapter_order: 0,
      body: "",
      love: false,
      book_id: 0,
      author_id: 0,
    },
  ]);
  const [page, setPage] = createSignal(1);
  const [currentPage, setCurrentPage] = createSignal(1);
  createEffect(async () => {
    const params = useParams<{ id: string }>();
    const ID = Number(params.id);
    const response = await services?.bookService.getBook(ID, currentPage(), 10);
    setArticles(response?.detail ?? []);
    setPage(response?.page ?? 1);
  });
  return (
    <Show when={articles()} fallback="<h1>Loading</h1>">
      <List>
        <For each={articles()}>
          {(article) => <ArticleRow article={article} />}
        </For>
      </List>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPage={page}
      />
    </Show>
  );
}
