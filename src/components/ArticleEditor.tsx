import { Box, FormControl, OutlinedInput, FormHelperText, TextField } from "@suid/material";
import { Accessor, Setter } from "solid-js";
import { Article } from "~/models/article.model";

export function ArticleEditor(props: { article: Accessor<Article>, setArticle: Setter<Article> }) {
    return (
        <>
            <Box sx={{ textAlign: "center" }}>
                <div>
                    <FormControl
                        sx={{
                            m: 1,
                            width: "50ch",
                        }}
                        variant="outlined"
                    >
                        <OutlinedInput
                            aria-describedby="outlined-title-helper-text"
                            inputProps={{ "aria-label": "标题" }}
                            onChange={(e) => {
                                props.setArticle({
                                    ...props.article(),
                                    title: e.currentTarget.value
                                })

                            }}
                        />
                        <FormHelperText id="outlined-title-helper-text">
                            标题
                        </FormHelperText>
                    </FormControl>


                    <FormControl
                        sx={{
                            m: 1,
                            width: "50ch",
                        }}
                        variant="outlined"
                    >
                        <OutlinedInput
                            aria-describedby="outlined-author-helper-text"
                            inputProps={{ "aria-label": "作者" }}
                            onChange={e => props.setArticle({ ...props.article(), author: e.currentTarget.value })}
                        />
                        <FormHelperText id="outlined-author-helper-text">
                            作者
                        </FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <FormControl
                        sx={{
                            m: 1,
                            width: "50ch",
                        }}
                        variant="outlined"
                    >
                        <OutlinedInput
                            aria-describedby="outlined-book-helper-text"
                            inputProps={{ "aria-label": "书籍" }}
                            onChange={e => props.setArticle({ ...props.article(), book: e.currentTarget.value })}
                        />
                        <FormHelperText id="outlined-book-helper-text">
                            书籍
                        </FormHelperText>
                    </FormControl>
                    <FormControl
                        sx={{
                            m: 1,
                            width: "50ch",
                        }}
                        variant="outlined"
                    >
                        <OutlinedInput
                            aria-describedby="outlined-chapter-helper-text"
                            inputProps={{ "aria-label": "章节序号" }}
                            value={props.article().chapter_order}
                            type="number"
                            onChange={e => props.setArticle({ ...props.article(), chapter: Number(e.currentTarget.value) })}
                        />
                        <FormHelperText id="outlined-chapter-helper-text">
                            章节序号
                        </FormHelperText>
                    </FormControl>
                </div>
                <div>
                    <FormControl
                        sx={{
                            m: 1,
                            width: "75ch",
                            height: "100ch",
                        }}
                        variant="outlined"
                    >
                        <TextField
                            id="standard-multiline-static"
                            label="正文"
                            multiline
                            rows={4}
                            defaultValue="Default Value"
                            variant="standard"
                            onChange={e => {
                                props.setArticle({
                                    ...props.article(), 
                                    body: e.currentTarget.value
                                });
                            }} />
                    </FormControl>
                </div>
            </Box>
        </>
    );
}