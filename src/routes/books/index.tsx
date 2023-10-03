import { List, ListItem, ListItemButton } from "@suid/material";
import { createMemo, createResource, createSignal, For, Resource } from "solid-js";
import { A } from "solid-start";
import { Pagination } from "~/components/Pagination";
import { ServerRootUrl } from "~/environments";


type Book = {
    author: string;
    title: string;
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
            <List>
                <For each={books()}>
                    {book =>
                        <ListItem>
                            <A href={`/books/${book.author}/${book.title}`}>
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

export default function ArticlesList() {
    const [data, { refetch }] = createResource(getBooks);
    return list(data, refetch)
}
