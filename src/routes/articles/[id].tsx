import { createSignal, Match, Show, Switch } from "solid-js";
import { ArticleReader } from "~/components/ArticleReader";
import { Button } from "@suid/material";
import type { Article } from "~/core/articles/article.model";
import { useParams } from "@solidjs/router";
import { ArticleEditor } from "~/components/ArticleEditor";
import { useService } from "../store/service";

export default function ArticleDetail() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);

  enum Mode {
    Reader,
    Editor,
  }
  const [mode, setMode] = createSignal<Mode>(Mode.Reader);

  const services = useService();
  const [article, setArticle] = createSignal<Article>({
    title: "",
    author: "",
    book: "",
    chapter_order: 0,
    body: "",
    love: false,
    book_id: 0,
    author_id: 0,
  });

  services?.articleService.getArticle(id).then((article) => {
    setArticle(article);
  });

  const deleteArticle = async () => {
    await services?.articleService.deleteArticle(id);
  };

  return (
    <>
      <Show
        when={typeof article() !== "undefined"}
        fallback={<div>Loading...</div>}
      >
        <Switch>
          <Match when={mode() === Mode.Reader}>
            <Button
              onClick={() => {
                setArticle(article()!);
                setMode(Mode.Editor);
              }}
            >
              修改
            </Button>
            <Button color="error" onclick={deleteArticle}>
              删除
            </Button>
            <ArticleReader article={article()!} />
          </Match>
          <Match when={mode() === Mode.Editor}>
            <Show
              when={typeof article() !== "undefined"}
              fallback={<div>文章不存在</div>}
            >
              <Button onClick={() => setMode(Mode.Reader)}>返回</Button>
              <ArticleEditor article={article} setArticle={setArticle} />
              <Button color="error" onclick={deleteArticle}>
                提交
              </Button>
            </Show>
          </Match>
        </Switch>
      </Show>
    </>
  );
}
