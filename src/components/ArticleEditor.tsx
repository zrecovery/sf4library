import {
  Box,
  FormControl,
  OutlinedInput,
  FormHelperText,
  TextField,
} from "@suid/material";
import type { EventParam } from "@suid/types/events";
import type { Accessor, Setter } from "solid-js";
import type { Article } from "~/core/articles/article.model";

export function ArticleEditor(props: {
  article: Accessor<Article>;
  setArticle: Setter<Article>;
}) {
  const { article, setArticle } = props;
  const handleChange =
    (key: keyof Article) =>
    (e: EventParam<HTMLInputElement | HTMLTextAreaElement>) => {
      props.setArticle({
        ...props.article(),
        [key]: e.currentTarget.value,
      });
    };

  return (
    <>
      <Box sx={{ textAlign: "center" }}>
        <div>
          <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
            <OutlinedInput
              aria-describedby="outlined-title-helper-text"
              inputProps={{ "aria-label": "标题" }}
              onChange={handleChange("title")}
              value={article().title}
            />
            <FormHelperText id="outlined-title-helper-text">
              标题
            </FormHelperText>
          </FormControl>

          <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
            <OutlinedInput
              aria-describedby="outlined-author-helper-text"
              inputProps={{ "aria-label": "作者" }}
              onChange={handleChange("author")}
              value={article().author}
            />
            <FormHelperText id="outlined-author-helper-text">
              作者
            </FormHelperText>
          </FormControl>
        </div>
        <div>
          <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
            <OutlinedInput
              aria-describedby="outlined-book-helper-text"
              inputProps={{ "aria-label": "书籍" }}
              onChange={handleChange("book")}
              value={article().book}
            />
            <FormHelperText id="outlined-book-helper-text">书籍</FormHelperText>
          </FormControl>
          <FormControl sx={{ m: 1, width: "50ch" }} variant="outlined">
            <OutlinedInput
              aria-describedby="outlined-chapter-helper-text"
              inputProps={{ "aria-label": "章节序号" }}
              value={article().chapter_order}
              type="number"
              onChange={handleChange("chapter_order")}
            />
            <FormHelperText id="outlined-chapter-helper-text">
              章节序号
            </FormHelperText>
          </FormControl>
        </div>
        <div>
          <FormControl
            sx={{ m: 1, width: "75ch", height: "100ch" }}
            variant="outlined"
          >
            <TextField
              id="standard-multiline-static"
              label="正文"
              multiline
              rows={4}
              defaultValue="Default Value"
              variant="standard"
              onChange={handleChange("body")}
              value={article().body}
            />
          </FormControl>
        </div>
      </Box>
    </>
  );
}
