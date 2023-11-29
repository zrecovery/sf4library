import { List, ListItem, ListItemButton } from "@suid/material";
import { createEffect, createSignal, For } from "solid-js";
import { Pagination } from "~/components/Pagination";
import "./index.css";
import { Author } from "~/core/authors/author.model";
import { useNavigate, useSearchParams } from "solid-start";
import { useService } from "../store/service";

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
        size: 10,
      })
      .then((res) => {
        setAuthors(res.detail);
        setTotalPage(res.page);
      });
  });

  return (
    <>
      <div class="grid">
        <List class="list">
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
        <div class="pagination">
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
