export default function ArticleRow(props) {
  return <>
    <a href={`/articles/${String(props.article.id)}`}>{props.article.title}</a>
  </ >
}
