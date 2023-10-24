
import { List, ListItem, ListItemButton } from "@suid/material";
import { createMemo, createResource, createSignal, For } from "solid-js";
import { A, useParams, useSearchParams } from "@solidjs/router";
import { Pagination } from "@/components/Pagination";
import { ServerRootUrl } from "@/environments";
import "./index.css";
import { Author } from "@/models/author.model";

const getAuthorsById = async (): Promise<Author[]> => {
    const params = useParams<{ id: string }>()
    const ID = params.id
    const response = await fetch(`${ServerRootUrl}/authors/${ID}`);
    return await response.json() as Author[];
};



export default function AuthorList() {
    const [searchParams] = useSearchParams();
    const [page, setPage] = createSignal(Number(searchParams.page ?? 1));
    const authorsListURI = createMemo(() => `${ServerRootUrl}/authors?page=${page()}`)
    const getAuthors = async (): Promise<Author[]> => {
        const response = await fetch(authorsListURI());
        return await response.json() as Author[];
    };

    const [authors, { refetch }] = createResource(getAuthors);
    return <>
        <div class="grid">
            <List class="list">
                <For each={authors()}>
                    {author =>
                        <ListItem>
                            <A href={`/authors/${author.id}`}>
                                <ListItemButton>
                                    {author.name}
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
