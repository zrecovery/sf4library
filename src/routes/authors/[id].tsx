import { List, ListItem, ListItemButton } from "@suid/material";
import { createResource, For, Resource } from "solid-js";
import { A, useNavigate, useParams } from "solid-start";
import { ServerRootUrl } from "../../environments";
import { Book } from "../../models/book.model";
import { QueryResult } from "~/models/query-result.model";

const getBooksByAuthorId = async (): Promise<QueryResult<Book[]>> => {
  const params = useParams<{ id: string }>();
  const ID = params.id;
  const response = await fetch(`${ServerRootUrl}/authors/${ID}?page=1`);
  return (await response.json()) as QueryResult<Book[]>;
};

function showBooks(books: Resource<QueryResult<Book[]>>) {
  const navigate = useNavigate();

  return (
    <List>
      <For each={books()?.detail}>
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

/**
 * A function that renders the details of an author.
 *
 * @return {React.Element} The rendered component.
 */
export default function AuthorDetail() {
  const [data] = createResource(getBooksByAuthorId);
  return showBooks(data);
}
