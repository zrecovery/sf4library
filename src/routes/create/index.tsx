import { Button } from "@suid/material";
import { Show, createSignal } from "solid-js";
import { ArticleEditor } from "~/components/ArticleEditor";
import { ServerRootUrl } from "~/environments";
import { Article } from "~/models/article.model";


export default function Create() {
    const [article, setArticle] = createSignal<Article>({
        title: "",
        author: "",
        book: "",
        chapter_order: 1.0,
        book_id: NaN,
        body: "",
        love: false,
        author_id: NaN
    })

    const createArticle = async () => {
        try {
            const response = await fetch(`${ServerRootUrl}/articles`, {
                method: "Post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(article()),
            });
            if (response.status !== 201) {
                throw new Error(`返回值${response.status}不为201`);
            }
        } catch {
            console.error("创建失败.");
        }
    }

    return <>
        <ArticleEditor article={article} setArticle={setArticle} />
        <Button onClick={createArticle}>提交</Button>
    </>
}