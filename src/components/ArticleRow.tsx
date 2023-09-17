import { A } from "solid-start";
import { Article } from "~/models/article.model";

type ArticleRowProps = {
    article: Article;
};

export function ArticleRow(props: ArticleRowProps) {
    const { article } = props
    return <>
        <A href={`/articles/${String(article.id)}`}>
            <div>{article.title}</div>
            <div>{article.serial_name}</div>
            <div>{article.author}</div>
        </A>
    </ >
};

export default ArticleRow;
