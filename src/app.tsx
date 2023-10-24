import { Route, Routes } from "@solidjs/router";
import { Component } from "solid-js";
import Navbar from "./components/header";
import ArticlesList from "./routes/articles/articleList";
import ArticleDetail from "./routes/articles/articleDetail";
import BooksList from "./routes/books/bookList";
import BookDetail from "./routes/books/bookDetail";
import AuthorDetail from "./routes/authors/authorDetail";
import AuthorList from "./routes/authors/authorList";

const App: Component = () => {
    return (
        <>
            <Navbar />
            <main>
                <Routes>
                    <Route path="/articles" component={ArticlesList} />
                    <Route path="/articles/:id" component={ArticleDetail} />
                    <Route path="/books" component={BooksList} />
                    <Route path="/books/:id" component={BookDetail} />
                    <Route path="/authors" component={AuthorList} />
                    <Route path="/authors/:id" component={AuthorDetail} />
                </Routes>
            </main>
        </>
    )
};

export default App;
