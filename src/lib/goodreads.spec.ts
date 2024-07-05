import fs from "fs";
import path from "path";

import { Goodreads } from "./goodreads";

describe("Goodreads", () => {
  const mockFetch = jest.fn().mockResolvedValue({
    ok: true,
    text: () =>
      Promise.resolve(
        fs.readFileSync(
          path.resolve(__dirname, "../__tests__/goodreads.html"),
          "utf8",
        ),
      ),
  } as Response);

  it("should fetch data for the book", async () => {
    const gr = new Goodreads(mockFetch);
    const score = await gr.getBookScore("Learning GitHub Actions");
    expect(score).toMatchObject({
      averageRating: 4.26,
      ratingsCount: 900,
    });
  });
});
