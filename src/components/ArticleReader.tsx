import { Article } from "../models/article.model";
import { Box, Typography } from "@suid/material";

interface ArticleReaderProps {
  article: Article;
}

export function ArticleReader(props: ArticleReaderProps) {
  return (
    <Box
      maxWidth="50rem"
      justifySelf="center"
      justifyContent="center"
      justifyItems="center"
      margin="0 auto"
    >
      <Typography variant="h5" component="div" gutterBottom>
        <h1>{props.article.title}</h1>
      </Typography>
      <Typography variant="h6" gutterBottom component="div">
        <h2>{props.article.author}</h2>
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        component="div"
        justifyContent={"center"}
      >
        <article
          style={{
            "white-space": "pre-wrap",
            "word-wrap": "break-word",
            "line-height": "1.5",
            "justify-content": "center",
            "justify-self": "center",
            "justify-items": "center",
            "text-align": "start",
          }}
        >
          {props.article.body}
        </article>
      </Typography>
    </Box>
  );
}
