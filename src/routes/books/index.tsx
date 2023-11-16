import { List, ListItem, ListItemButton } from "@suid/material";
import { createMemo, createResource, createSignal, For } from "solid-js";
import { A, useNavigate, useSearchParams } from "solid-start";
import { Pagination } from "../../components/Pagination";
import { ServerRootUrl } from "../../environments";
import "./index.css";
import { Book } from "../../models/book.model";

export default function BooksList() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = createSignal(Number(searchParams.page ?? 1));
  const booksListURI = createMemo(
    () => `${ServerRootUrl}/books?page=${page()}`,
  );
  const getBooks = async (): Promise<Book[]> => {
    const response = await fetch(booksListURI());
    return (await response.json()) as Book[];
  };

  const [books, { refetch }] = createResource(getBooks);
  const navigate = useNavigate();
  return (
    <>
      <div class="grid">
        <List class="list">
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
        <div class="pagination">
          <Pagination page={page} setPage={setPage} action={refetch} />
        </div>
      </div>
    </>
  );
}
