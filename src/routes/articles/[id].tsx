import { createResource, createSignal, Resource, Show } from 'solid-js'
import { useParams } from 'solid-start'
import { ArticleReader } from '~/components/ArticleReader';
import { ServerRootUrl } from '~/environments';
import { Article } from '~/models/article.model';
import { Button } from "@suid/material"

const fetchArticle = async (id: string): Promise<Article> =>
    (await fetch(`${ServerRootUrl}/articles/${id}`)).json();

// 生成删除指定文章的函数
const deleteArticleURI = (id: string) => {
    return async () => {
        const response = await fetch(`${ServerRootUrl}/articles/${id}`, { method: "DELETE" });
        if (response.status !== 204) {
            throw new Error("删除失败");
        };
    }
}


export default function id() {
    const params = useParams<{ id: string }>()
    const id = params.id
    const [articleId, setArticleId] = createSignal(id);
    const [article] = createResource(articleId, fetchArticle);
    const deleteArticle = deleteArticleURI(id)
    // article() 必须预先执行，否则后续会处于undefined.
    article()
    return <>
        <Show when={!article.loading && typeof article() !== 'undefined'} fallback={<div>Loading...</div>}>
            <Button color="error" onclick={deleteArticle}>删除</Button>
            <ArticleReader article={article()!} />
        </Show>
    </>
}
