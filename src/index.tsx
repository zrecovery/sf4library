// @refresh reload
import { Suspense, ErrorBoundary } from "solid-js";
import { render } from 'solid-js/web';
import {
    Router,
} from "@solidjs/router";
import "./index.css";
import App from "./app";

const root = document.getElementById('root');

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
    throw new Error(
        'Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?',
    );
}


render(
    () => (
        <Suspense>
            <ErrorBoundary fallback={(err, reset) => <div onClick={reset}>Error: {err.toString()}</div>}>
            <Router>
      <App />
    </Router>
            </ErrorBoundary>
        </Suspense>
    ),
    root,
);


