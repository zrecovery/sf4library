import { HttpHeader } from "@solidjs/start";
import { createHandler, StartServer } from "@solidjs/start/server";
import "uno.css";

export default createHandler(() => (
    <StartServer
        document={({ assets, children, scripts }) => (
            <html lang="en">
                <head>
                    <meta name="viewport" content="width=device-width,initial-scale=1" />
                    <meta charset="utf-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <meta name="mobile-web-app-capable" content="yes" />
                    <meta name="apple-mobile-web-app-capable" content="yes" />
                    <meta name="application-name" content="zrLib" />
                    <meta name="apple-mobile-web-app-title" content="zrLib" />
                    <meta name="theme-color" content="black" />
                    <link rel="icon" href="/favicon.ico" />
                    {assets}
                </head>
                <body class="m-0 grid grid-rows-12 h-screen">
                    <div id="app">{children}</div>
                    {scripts}
                </body>
            </html>
        )}
    />
));
