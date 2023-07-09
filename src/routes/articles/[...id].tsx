import { createResource, Resource } from 'solid-js'
import { useParams } from 'solid-start'

type Article = {
    id: number;
    title: string;
    author: string;
    serial_name: string;
    serial_order: number;
    article_content: string;
}

const params = useParams<{ id: string }>()
const ID = params.id

const getArticle = async (): Promise<Article> => {
    const response = await fetch(`http://localhost:3000/articles/${ID}`);
    return await response.json() as Article;
};

const deleteArticle = async () => {
    console.log("hello")
    const response = await fetch(`http://localhost:3000/articles/${ID}`, { method: "DELETE" });
    console.log("h2")
    return await response.json()
}

function showArticle(art: Resource<Article>) {
    return <div>
        <h2>{art()?.title}</h2>
        <h3>{art()?.author}</h3>
        <h3>{art()?.serial_name}</h3>
        <h3>{art()?.serial_order}</h3>
        <button onClick={deleteArticle}>删除</button>
        <div style={{ "white-space": "pre-wrap" }}>{art()?.article_content}</div>
    </div>
}



export default function id() {
    const [data] = createResource(getArticle)
    return showArticle(data)
}
