import type { Article } from "../core/articles/article.model";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Divider,
  Box,
} from "@suid/material";
import { type Accessor, createSignal, type Setter, Show } from "solid-js";
import { Favorite, FavoriteBorder } from "@suid/icons-material";

import { useService } from "~/routes/store/service";
import { A } from "@solidjs/router";

type ArticleRowProps = {
  article: Article;
};

const services = useService();

async function updateFavorite(
  article: Article,
  favorite: Accessor<boolean>,
  setFavorite: Setter<boolean>,
) {
  const newFavoriteValue = !favorite();

  setFavorite(newFavoriteValue);
  article.love = newFavoriteValue;

  try {
    await services?.articleService.updateArticle(article);
  } catch (error) {
    console.error(`${article.id}修改失败.`, error);
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
