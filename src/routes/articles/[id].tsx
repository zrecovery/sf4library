import { createResource, Resource, Show } from 'solid-js'
import { useParams } from 'solid-start'
import { ArticleReader } from '~/components/ArticleReader';
import { ServerRootUrl } from '~/environments';
import { Article } from '~/models/article.model';

const getArticle = async (): Promise<Article> => {
    const params = useParams<{ id: string }>()
    const ID = params.id
    const response = await fetch(`${ServerRootUrl}/articles/${ID}`);
    return await response.json() as Article;
};

// 生成删除指定文章的函数
const deleteArticleURI = (ID: string) => {
    return async () => {
        const response = await fetch(`${ServerRootUrl}/articles/${ID}`, { method: "DELETE" });
        return await response.json()
    }
}
function showArticle(art: Resource<Article>, id: string) {
    const deleteArticle = deleteArticleURI(id)
    return <div>
        <Show when={!art.loading} fallback={<div>Loading...</div>}>
            <ArticleReader article={art()} />
            <button onclick={deleteArticle}>删除</button>
        </Show>
    </div>
}



export default function id() {
    const params = useParams<{ id: string }>()
    const ID = params.id

    const [data] = createResource(getArticle)
    return showArticle(data, ID)
}
