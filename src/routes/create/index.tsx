import { Button } from "@suid/material";
import { createSignal, createResource } from "solid-js";
import { ArticleEditor } from "~/components/ArticleEditor";
import type { Article } from "~/core/articles/article.model";
import { useService } from "../store/service";

export default function Create() {
  const [article, setArticle] = createSignal<Article>({
    title: "",
    author: "",
    book: "",
    chapter_order: 1.0,
    book_id: NaN,
    body: "",
    love: false,
    author_id: NaN,
  });

  const services = useService();
  const createArticle = async () => { await services?.articleService.createArticle(article()) };

  return (
    <>
      <ArticleEditor article={article} setArticle={setArticle} />
      <Button onClick={createArticle}>提交</Button>
    </>
  );
}
