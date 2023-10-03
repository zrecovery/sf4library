// @refresh reload
import { Suspense } from "solid-js";
import {
    A,
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
import Navbar from "./components/header";
import "./root.css";

export default function Root() {
    return (
        <Html lang="en">
            <Head>
                <Title>电子书管理</Title>
                <Meta charset="utf-8" />
                <Meta name="viewport" content="width=device-width, initial-scale=1" />
                <link
                    href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
                    rel="stylesheet"
                />
            </Head>
            <Body>
                <Suspense>
                    <ErrorBoundary>
                        <Navbar />
                        <Routes>
                            <FileRoutes />
                        </Routes>
                    </ErrorBoundary>
                </Suspense>
                <Scripts />
            </Body>
        </Html>
    );
}
