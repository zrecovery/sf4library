import { createMemo, createResource, createSignal, For, Resource } from "solid-js";
import { A } from "solid-start";
import { Pagination } from "~/components/Pagination";
import { ServerRootUrl } from "~/environments";


type Book = {
    author: string;
    serial_name: string;
}

const [page, setPage] = createSignal(1)
const booksListURI = createMemo(() => `${ServerRootUrl}/books?page=${page()}`)
const getBooks = async (): Promise<Book[]> => {
    const response = await fetch(booksListURI());
    return await response.json() as Book[];
};


function list(books: Resource<Book[]>, refetch: any) {
    return <>
        <div class="grid">
            <ul class="list">
                <For each={books()}>
                    {book => <li><A href={`/books/${book.author}/${book.serial_name}`}>{book.serial_name}</A></li>}
                </For>
            </ul>
            <div class="pagination">
                <Pagination page={page} setPage={setPage} action={refetch}></Pagination>
            </div>
        </div>
    </>
}

export default function ArticlesList() {
    const [data, { refetch }] = createResource(getBooks);
    return list(data, refetch)
}
