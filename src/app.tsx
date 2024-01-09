// @refresh reload
import { MetaProvider, Title } from "@solidjs/meta";
import Navbar from "./components/Navbar";
import { ServiceProvider } from "./routes/store/service.provider";
import "uno.css";
import { Router } from "@solidjs/router";
import { FileRoutes, HttpHeader } from "@solidjs/start";
import { Suspense } from "solid-js";

export default function App() {
    return (
        <>
            <HttpHeader name="Cross-Origin-Embedder-Policy" value="require-corp" />
            <HttpHeader name="Cross-Origin-Opener-Policy" value="same-origin" />

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
                <FileRoutes />
            </Router>
        </>
    );
}
