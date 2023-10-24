import { List, ListItem, ListItemButton } from '@suid/material';
import { createResource, For, Resource } from 'solid-js'
import { A, useParams } from '@solidjs/router';
import { ServerRootUrl } from '@/environments';
import { Book } from '@/models/book.model';

const getBooksByAuthor = async (): Promise<Book[]> => {
    const params = useParams<{ id: string }>()
    const ID = params.id
    const response = await fetch(`${ServerRootUrl}/authors/${ID}`);
    return await response.json() as Book[];
};


function showBooks(books: Resource<Book[]>) {
    return <List>
        <For each={books()}>
            {book => <ListItem>
                <A href={`/books/${book.id}`}>
                    <ListItemButton>
                        {book.title}
                    </ListItemButton>
                </A>
            </ListItem>}
        </For>
    </List>
}



export default function AuthorDetail() {

    const [data] = createResource(getBooksByAuthor)
    return showBooks(data)
}
