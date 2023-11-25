import { Article } from "../models/article.model";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Box,
} from "@suid/material";
import { Accessor, createSignal, Setter, Show } from "solid-js";
import { Favorite, FavoriteBorder } from "@suid/icons-material";
import { ServerRootUrl } from "../environments";
import { A } from "solid-start";
import {
  ArticleFetchReposirory,
  ArticleService,
} from "~/services/article.service";

type ArticleRowProps = {
  article: Article;
};

const articleRepository = new ArticleFetchReposirory();
const articleService = ArticleService.single(articleRepository);

async function updateFavorite(
  article: Article,
  favorite: Accessor<boolean>,
  setFavorite: Setter<boolean>,
) {
  setFavorite(!favorite());
  article.love = favorite();
  try {
    articleService.updateArticle(article);
  } catch {
    console.error(`${article.id}修改失败.`);
  }
}

export function ArticleRow(props: ArticleRowProps) {
  const { article } = props;
  const [favorite, setFavorite] = createSignal(article.love);

  return (
    <>
      <ListItem>
        <Box
          sx={{
            display: "grid",
            gridTemplateAreas: '"info love"',
            gridTemplateColumns: "9fr 3fr",
            width: "100%",
          }}
        >
          <div style={{ "grid-area": "info" }}>
            <A href={`/articles/${String(article.id)}`}>
              <ListItemText>{article.title}</ListItemText>
            </A>
            <A href={`/books/${String(article.book_id)}`}>
              <ListItemText>{article.book}</ListItemText>
            </A>
            <A href={`/authors/${String(article.author_id)}`}>
              <ListItemText>{article.author}</ListItemText>
            </A>
          </div>
          <div style={{ "grid-area": "love", "justify-self": "end" }}>
            <ListItemIcon>
              <IconButton
                onClick={() => updateFavorite(article, favorite, setFavorite)}
              >
                <Show when={favorite()} fallback={<FavoriteBorder />}>
                  <Favorite />
                </Show>
              </IconButton>
            </ListItemIcon>
          </div>
        </Box>
      </ListItem>
      <Divider />
    </>
  );
}

export default ArticleRow;
