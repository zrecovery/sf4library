import { List, ListItem, ListItemButton } from "@suid/material";
import { createEffect, createSignal, For } from "solid-js";
import { Pagination } from "~/components/Pagination";
import type { Author } from "~/core/authors/author.model";
import { useService } from "../store/service";
import { useNavigate, useSearchParams } from "@solidjs/router";
import type { QueryResult } from "~/core/dto/query-result.model";

export default function AuthorList() {
  const [searchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = createSignal(
    Number(searchParams["page"] ?? 1)
  );

  const [data, setData] = createSignal<QueryResult<Author[]>>();
  const services = useService();
  
  const [page, setPage] = createSignal(1);

  createEffect(async () => {
    const res = await services?.authorService.getAuthors({
        page: currentPage(),
        size: 4,
      })
        setData(res);
        setPage(res?.page ?? 1);

  });

  const navigate = useNavigate();
  return (
    <>
      <div class="grid grid-rows-9 h-full">
        <List class="grid-row-start-1 grid-row-end-9">
          <For each={data()?.detail}>
            {(author) => (
              <ListItem>
                <ListItemButton
                  onClick={() => {
                    navigate(`/authors/${author.id}`);
                  }}
                >
                  {author.name}
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
