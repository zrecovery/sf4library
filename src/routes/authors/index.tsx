import { List, ListItem, ListItemButton } from "@suid/material";
import { createMemo, createResource, createSignal, For } from "solid-js";

import { Pagination } from "../../components/Pagination";
import { ServerRootUrl } from "../../environments";
import "./index.css";
import { Author } from "../../models/author.model";
import { A, useNavigate, useSearchParams } from "solid-start";

export default function AuthorList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [page, setPage] = createSignal(Number(searchParams.page ?? 1));
  const authorsListURI = createMemo(
    () => `${ServerRootUrl}/authors?page=${page()}`,
  );
  const getAuthors = async (): Promise<Author[]> => {
    const response = await fetch(authorsListURI());
    return (await response.json()) as Author[];
  };

  const [authors, { refetch }] = createResource(getAuthors);

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
          <Pagination page={page} setPage={setPage} action={refetch} />
        </div>
      </div>
    </>
  );
}
