// @refresh reload
import "uno.css";
import { Suspense } from "solid-js";
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Meta,
  Routes,
  Scripts,
  Title,
} from "solid-start";
import Navbar from "./components/Navbar";
import { ServiceProvider } from "./routes/store/service.provider";
import "uno.css";

export default function Root() {
  return (
    <Html lang="en">
      <Head>
        <Title>图书馆</Title>
        <Meta charset="utf-8" />
        <Meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Body class="m-0 grid grid-rows-12 h-screen">
        <Suspense>
          <ErrorBoundary>
            <ServiceProvider>
              <div class="grid-row-start-1 grid-row-end-2 min-h-4">
                <Navbar />
              </div>
              <div class="m-4 grid-row-start-2 grid-row-end-13">
                <Routes>
                  <FileRoutes />
                </Routes>
              </div>
            </ServiceProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  );
}
