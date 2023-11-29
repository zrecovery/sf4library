import { List, ListItem, ListItemButton } from "@suid/material";
import { createEffect, createSignal, For } from "solid-js";
import { useNavigate, useSearchParams } from "solid-start";
import { Pagination } from "../../components/Pagination";
import "./index.css";
import { Book } from "~/core/books/book.model";

import { QueryResult } from "~/core/dto/query-result.model";
import { useService } from "../store/service";

export default function BooksList() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = createSignal(
    Number(searchParams.page ?? 1),
  );
  const [data, setData] = createSignal<QueryResult<Book[]>>();
  const service = useService();
  const [page, setPage] = createSignal(1);
  createEffect(async () => {
    const response = await service.bookService.getBooks(currentPage(), 10);
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
