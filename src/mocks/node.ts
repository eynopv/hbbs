import fs from "fs";
import path from "path";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";

const humbleBundleHtml = fs.readFileSync(
  path.resolve(__dirname, "./humble.html"),
  "utf8",
);

const goodreadsHtml = fs.readFileSync(
  path.resolve(__dirname, "./goodreads.html"),
  "utf8",
);

const handlers = [
  http.get(`https://www.humblebundle.com/books/example-bundle`, () => {
    return new HttpResponse(humbleBundleHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }),
  http.get(`https://www.humblebundle.com/books/not-book-bundle`, () => {
    return new HttpResponse(
      `<script id="webpack-bundle-page-data" type="application/json">
      {
        "bundleData": {
          "basic_data": {
            "media_type": "not-book"
          }
        }
      }
      </script>`,
      {
        headers: {
          "Content-Type": "text/html",
        },
      },
    );
  }),
  http.get("https://www.goodreads.com/search", () => {
    return new HttpResponse(goodreadsHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  }),
];

export const server = setupServer(...handlers);
