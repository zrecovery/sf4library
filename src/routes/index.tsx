/// <reference lib="dom" />
/// <reference lib="esnext" />
import { ArticleService } from "~/core/articles/article.service";
import { ArticleSqliteRepository } from "~/infrastructure/repository/sqlite/article.sqlite.repository";
import { useService } from "./store/service";
import { Title } from "solid-start";


export default function Home() {
    const services = useService();
    let load_db: HTMLInputElement;
    const uploadHandle = () => {
        if (load_db.files) {
            const file = load_db.files[0];
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            reader.onloadend = () => {
                const buffer: ArrayBuffer = reader.result as ArrayBuffer;
                const articleRepository = new ArticleSqliteRepository(buffer);
                const articleService = new ArticleService(articleRepository);
                services!.articleService = articleService;
            }
        };


    }

    return (
        <main>
            <Title>欢迎</Title>
            <h1>Hello World2</h1>
            <input type='file' ref={load_db} />
            <button onClick={uploadHandle}>upload</button>
        </main>
    );
}
