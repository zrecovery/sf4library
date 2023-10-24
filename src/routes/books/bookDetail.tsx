import { List } from '@suid/material';
import { createResource, For, Resource } from 'solid-js'
import { useParams } from '@solidjs/router';
import ArticleRow from '@/components/ArticleRow';
import { ServerRootUrl } from '@/environments';

type Article = {
    id: number;
    title: string;
    author: string;
    serial_name: string;
    serial_order: number;
    article_content: string;
}

const getArticlesByBook = async (): Promise<Article[]> => {
    const params = useParams<{ id: string}>()
    const ID = params.id
    const response = await fetch(`${ServerRootUrl}/books/${ID}`);
    return await response.json() as Article[];
};


function showArticle(articles: Resource<Article[]>, id: string) {
    return <List>
        <For each={articles()}>
            {article => <ArticleRow article={article} />}
        </For>
    </List>
}



export default function BookDetail() {
    const params = useParams<{ id: string }>()
    const ID = params.id

    const [data] = createResource(getArticlesByBook)
    return showArticle(data, ID)
}
