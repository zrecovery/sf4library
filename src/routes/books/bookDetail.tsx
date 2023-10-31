import { List } from '@suid/material';
import { createResource, For, Resource, Show } from 'solid-js'
import { useParams } from '@solidjs/router';
import ArticleRow from '@/components/ArticleRow';
import { ServerRootUrl } from '@/environments';

type Article = {
    id: number;
    title: string;
    author: string;
    book: string;
    serial_order: number;
    body: string;
    author_id: number;
    book_id: number;
    love: boolean;
}

const getArticlesByBook = async (): Promise<Article[]> => {
    const params = useParams<{ id: string }>()
    const ID = params.id
    const response = await fetch(`${ServerRootUrl}/books/${ID}`);
    return await response.json() as Article[];
};


function showArticle(articles: Resource<Article[]>, id: string) {
    return <Show when={!articles.loading} fallback="<h1>Loading</h1>">
        <List>
            <For each={articles()}>
                {article => <ArticleRow article={article} />}
            </For>
        </List>
    </Show>
}



export default function BookDetail() {
    const params = useParams<{ id: string }>()
    const ID = params.id

    const [data] = createResource(getArticlesByBook)
    return showArticle(data, ID)
}
