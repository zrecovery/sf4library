import { List, ListItem, ListItemButton } from "@suid/material";
import { createResource, For, Resource } from "solid-js";
import { A, useNavigate, useParams } from "solid-start";
import { ServerRootUrl } from "../../environments";
import { Book } from "../../models/book.model";

/**
 * Retrieves a list of books by author ID.
 *
 * @return {Promise<Book[]>} A promise that resolves to an array of books.
 */
const getBooksByAuthorId = async (): Promise<Book[]> => {
  const params = useParams<{ id: string }>();
  const ID = params.id;
  const response = await fetch(`${ServerRootUrl}/authors/${ID}`);
  return (await response.json()) as Book[];
};

/**
 * Renders a list of books as a series of list items.
 *
 * @param {Resource<Book[]>} books - The resource containing an array of books.
 * @return {JSX.Element} The JSX element representing the list of books.
 */
function showBooks(books: Resource<Book[]>) {
  const navigate = useNavigate();

  return (
    <List>
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
