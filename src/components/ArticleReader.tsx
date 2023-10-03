import { Article } from "~/models/article.model";
import { Box, Typography } from "@suid/material";

interface ArticleReaderProps {
    article: Article;
}

export function ArticleReader(props: ArticleReaderProps) {
    return <Box>
        <Typography variant="h5" component="div" gutterBottom>
            <h1>{props.article.title}</h1>
        </Typography>
        <Typography variant="h6" gutterBottom component="div">
            <h2>{props.article.author}</h2>
        </Typography>
        <Typography variant="body1" gutterBottom component="div">
            <article style="white-space: pre-wrap; word-wrap: break-word;line-height: 1.5;">{props.article.body}</article>
        </Typography>
    </Box>
}
