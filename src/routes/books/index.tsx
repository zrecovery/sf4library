import { List, ListItem, ListItemButton } from "@suid/material";
import { createEffect, createSignal, For } from "solid-js";
import { A, useNavigate, useSearchParams } from "solid-start";
import { Pagination } from "../../components/Pagination";
import "./index.css";
import { BookFetchRepository, BookService } from "~/services/book.service";
import { QueryResult } from "~/models/query-result.model";
import { Book } from "~/models/book.model";

export default function BooksList() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = createSignal(
    Number(searchParams.page ?? 1),
  );
  const [data, setData] = createSignal<QueryResult<Book[]>>();
  const bookRepository = new BookFetchRepository();
  const bookService = new BookService(bookRepository);

  const [page, setPage] = createSignal(1);
  createEffect(async () => {
    const response = await bookService.getBooks(currentPage(), 10);
    setData(response);
    setPage(response?.page ?? 1);
  });

  const navigate = useNavigate();
  return (
    <>
      <div class="grid">
        <List class="list">
          <For each={data()?.detail}>
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
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPage={page}
          />
        </div>
      </div>
    </>
  );
}
