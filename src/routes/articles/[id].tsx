import { createResource, createSignal, Match, Show, Switch } from "solid-js";
import { ArticleReader } from "../../components/ArticleReader";
import { ServerRootUrl } from "../../environments";
import { Button } from "@suid/material";
import { Article } from "../../models/article.model";
import { useParams } from "solid-start";
import { ArticleEditor } from "~/components/ArticleEditor";

const fetchArticle = async (id: string): Promise<Article> =>
  (
    await fetch(`${ServerRootUrl}/articles/${id}`, {
      mode: "no-cors",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
  ).json();

// 生成删除指定文章的函数
const deleteArticleURI = (id: string) => {
  return async () => {
    const response = await fetch(`${ServerRootUrl}/articles/${id}`, {
      method: "DELETE",
    });
    if (response.status !== 204) {
      throw new Error("删除失败");
    }
  };
};

const updateArticle = async (article: Article) => {
  try {
    const response = await fetch(`${ServerRootUrl}/articles/${article.id}`, {
      method: "Put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(article),
    });
    if (response.status !== 204) {
      throw new Error(`返回值${response.status}不为204`);
    }
  } catch {
    console.error(`${article.id}修改失败.`);
  }
};

export default function ArticleDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [articleId, _] = createSignal(id);
  const [article] = createResource(articleId, fetchArticle);
  const deleteArticle = deleteArticleURI(id);
  // article() 必须预先执行，否则后续会处于undefined.
  article();
  const [art, setArt] = createSignal(article()!);
  enum Mode {
    Reader,
    Editor
  }
  const [mode, setMode] = createSignal<Mode>(Mode.Reader);

  return (
    <>
      <Show
        when={!article.loading && typeof article() !== "undefined"}
        fallback={<div>Loading...</div>}
      >

        <Switch >
          <Match when={mode() === Mode.Reader}>
            <Button onClick={() => { setMode(Mode.Editor); console.log(article()); setArt(article()); }}>修改</Button>
            <Button color="error" onclick={deleteArticle}>
              删除
            </Button>
            <ArticleReader article={article()!} />
          </Match>
          <Match when={mode() === Mode.Editor}>
            <Show when={typeof article() !== "undefined"} fallback={<div>文章不存在</div>}>
              <Button onClick={() => setMode(Mode.Reader)}>返回</Button>
              <ArticleEditor article={art} setArticle={setArt} />
              <Button color="error" onclick={deleteArticle}>提交</Button>
            </Show>l==
          </Match>
        </Switch>

      </Show>
    </>
  );
}
