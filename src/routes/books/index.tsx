import { List, ListItem, ListItemButton } from "@suid/material";
import { createEffect, createSignal, For } from "solid-js";

import { Pagination } from "../../components/Pagination";
import type { Book } from "~/core/books/book.model";

import type { QueryResult } from "~/core/dto/query-result.model";
import { useService } from "../store/service";
import { useSearchParams, useNavigate } from "@solidjs/router";

export default function BooksList() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = createSignal(
    Number(searchParams["page"] ?? 1)
  );
  const [data, setData] = createSignal<QueryResult<Book[]>>();
  const service = useService();
  const [page, setPage] = createSignal(1);
  createEffect(async () => {
    const response = await service?.bookService.getBooks(currentPage(), 10);
    setData(response);
    setPage(response?.page ?? 1);
  });

  const navigate = useNavigate();
  return (
    <>
      <div class="grid grid-rows-9 h-full">
        <List class="grid-row-start-1 grid-row-end-9">
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
        <div class="grid-row-start-9 grid-row-end-10">
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
