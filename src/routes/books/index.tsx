import { List, ListItem, ListItemButton } from "@suid/material";
import { createMemo, createResource, createSignal, For, Show } from "solid-js";

import { Pagination } from "../../components/Pagination";

import { useService } from "../store/service";
import { useSearchParams, useNavigate } from "@solidjs/router";

export default function BooksList() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = createSignal(
    Number(searchParams["page"] ?? 1)
  );
  const [page, setPage] = createSignal(1);
  const navigate = useNavigate();

  const service = useService();

  const fetchParams = createMemo(() => {
    return {
      page: currentPage(),
      size: 10,
    }
  });

  const fetchData = async (params: { page: number; size: number }) => {
    if (!service) {
      throw new Error("Service not found");
    }
    const result = await service.bookService.getBooks(params.page, params.size);
    setPage(result?.page ?? 1);
    return result;
  }

  const [data] = createResource(fetchParams, fetchData);

  return (
    <>
      <div class="grid grid-rows-9 h-full">
        <Show when={!data.loading} fallback={<h1>Loading</h1>}>
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
        </Show>
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
