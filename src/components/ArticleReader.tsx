import { Article } from "~/models/article.model"

interface ArticleReaderProps {
    article: Article;
}

export function ArticleReader(props: ArticleReaderProps) {
    return <>
        <h1>{props.article.title}</h1>
        <h2>{props.article.author}</h2>
        <article>{props.article.article_content}</article>
    </>
}
