import { List, ListItem, ListItemButton } from "@suid/material";
import { createMemo, createResource, createSignal, For } from "solid-js";
import { A, useParams, useSearchParams } from "@solidjs/router";
import { Pagination } from "@/components/Pagination";
import { ServerRootUrl } from "@/environments";
import "./index.css";
import { Book } from "@/models/book.model";

const getBooksById = async (): Promise<Book[]> => {
    const params = useParams<{ id: string}>()
    const ID = params.id
    const response = await fetch(`${ServerRootUrl}/authors/${ID}`);
    return await response.json() as Book[];
};



export default function BooksList() {
    const [searchParams] = useSearchParams();
    const [page, setPage] = createSignal(Number(searchParams.page ?? 1));
    const booksListURI = createMemo(() => `${ServerRootUrl}/books?page=${page()}`)
    const getBooks = async (): Promise<Book[]> => {
        const response = await fetch(booksListURI());
        return await response.json() as Book[];
    };

    const [books, { refetch }] = createResource(getBooks);
    return <>
        <div class="grid">
            <List class="list">
                <For each={books()}>
                    {book =>
                        <ListItem>
                            <A href={`/books/${book.id}`}>
                                <ListItemButton>
                                    {book.title}
                                </ListItemButton>
                            </A>
                        </ListItem>}
                </For>
            </List>
            <div class="pagination">
                <Pagination page={page} setPage={setPage} action={refetch} />
            </div>
        </div>
    </>

}
