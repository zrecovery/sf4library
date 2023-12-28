import { List, ListItem, ListItemButton } from "@suid/material";
import { createEffect, createSignal, For } from "solid-js";
import { Pagination } from "~/components/Pagination";
import { Author } from "~/core/authors/author.model";
import { useService } from "../store/service";
import { useNavigate, useSearchParams } from "@solidjs/router";

export default function AuthorList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = createSignal(
    Number(searchParams.page ?? 1),
  );
  const [totalPage, setTotalPage] = createSignal(1);
  const [authors, setAuthors] = createSignal([] as Author[]);

  const services = useService();

  createEffect(() => {
    services?.authorService
      .getAuthors({
        page: currentPage(),
        size: 4,
      })
      .then((res) => {
        setAuthors(res.detail);
        setTotalPage(res.page);
      });
  });

  return (
    <>
      <div class="grid grid-rows-9 h-full">
        <List class="grid-row-start-1 grid-row-end-9">
          <For each={authors()}>
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
            totalPage={totalPage}
          />
        </div>
      </div>
    </>
  );
}
