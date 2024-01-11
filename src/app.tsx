// @refresh reload
import { MetaProvider } from "@solidjs/meta";
import Navbar from "./components/Navbar";
import { ServiceProvider } from "./routes/store/service.provider";
import { Route, Router } from "@solidjs/router";
import { Suspense } from "solid-js";
import ArticlesList from "./routes/articles";
import Home from "./routes";
import BooksList from "./routes/books";
import ArticleDetail from "./routes/articles/[id]";
import BookDetail from "./routes/books/[id]";
import AuthorList from "./routes/authors";
import AuthorDetail from "./routes/authors/[id]";

export default function App() {
  return (
    <>
      <Router
        root={(props) => (
          <MetaProvider>
            <ServiceProvider>
              <div class="grid-row-start-1 grid-row-end-2 min-h-4">
                <Navbar />
              </div>
              <div class="m-4 grid-row-start-2 grid-row-end-13">
                <Suspense>{props.children}</Suspense>
              </div>
            </ServiceProvider>
          </MetaProvider>
        )}
      >
        <Route path="/articles" component={ArticlesList} />
        <Route path="/articles/:id" component={ArticleDetail} />
        <Route path="/books" component={BooksList} />
        <Route path="/books/:id" component={BookDetail} />
        <Route path="/author" component={AuthorList} />
        <Route path="/author/:id" component={AuthorDetail} />
        <Route path="/" component={Home} />
      </Router>
    </>
  );
}
