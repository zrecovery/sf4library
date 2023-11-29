import { List, ListItem, ListItemButton } from "@suid/material";
import { For, createEffect, createSignal } from "solid-js";
import { useNavigate, useParams } from "solid-start";
import { useService } from "../store/service";
import { Book } from "~/core/books/book.model";

export default function AuthorDetail() {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const [books, setBooks] = createSignal<Book[]>([]);
  const services = useService();
  createEffect(() => {
    services?.authorService.getAuthor(id).then((res) => {
      setBooks(res);
    });
  });
  return (
    <List>
      <For each={books()}>
        {(book) => (
          <ListItem>
            <ListItemButton
              onClick={() => {
                navigate(`/books/${book.id}`);
              }}
            >
              {book.title}
            </ListItemButton>
          </ListItem>
        )}
      </For>
    </List>
  );
}
