import { A } from "solid-start";
import { Article } from "~/models/article.model";
import { ListItem, ListItemText, ListItemButton } from "@suid/material";

type ArticleRowProps = {
    article: Article;
};

export function ArticleRow(props: ArticleRowProps) {
    const { article } = props
    return <ListItem>
        <ListItemButton >
            <A href={`/articles/${String(article.id)}`}>
                <ListItemText>{article.title}</ListItemText>
                <ListItemText>{article.book}</ListItemText>
                <ListItemText>{article.author}</ListItemText>
            </A>
        </ListItemButton>
    </ListItem>
};

export default ArticleRow;
