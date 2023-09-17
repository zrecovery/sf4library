import { createResource, For, Resource } from 'solid-js'
import { useParams } from 'solid-start'
import ArticleRow from '~/components/ArticleRow';
import { ServerRootUrl } from '~/environments';

type Article = {
    id: number;
    title: string;
    author: string;
    serial_name: string;
    serial_order: number;
    article_content: string;
}

const getArticlesByBook = async (): Promise<Article[]> => {
    const params = useParams<{ author:string,title: string }>()
    const TITLE = params.title
    const AUTHOR = params.author
    const response = await fetch(`${ServerRootUrl}/books?title=${TITLE}&author=${AUTHOR}`);
    return await response.json() as Article[];
};


function showArticle(articles: Resource<Article[]>, id: string) {
    return <div>
        <For each={articles()}>
            {article => <li><ArticleRow article={article} /></li>}
        </For>
    </div>
}



export default function id() {
    const params = useParams<{ id: string }>()
    const ID = params.id

    const [data] = createResource(getArticlesByBook)
    return showArticle(data, ID)
}
