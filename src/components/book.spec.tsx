import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import Book from "./book";

describe("Book", () => {
  it("renders correctly", async () => {
    render(
      <Book
        title="Test Book Title"
        coverImageUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjSJe+8R8ABKECWhMaL4oAAAAASUVORK5CYII="
        goodreadsData={{
          averageRating: 3.72,
          ratingsCount: 900,
          url: "example.com",
        }}
      />,
    );
    expect(screen.getByRole("heading")).toHaveTextContent("Test Book Title");
    expect(screen.getByText("Rating: 3.72")).toBeVisible();
    expect(screen.getByText("Reviews: 900")).toBeVisible();
    expect(screen.getByRole("img")).toBeVisible();
    expect(screen.queryByRole("link")).toHaveAttribute("href");
    expect(screen.queryByRole("link")?.getAttribute("href")).toBe(
      "example.com",
    );
  });

  it("renders correctly when goodreadsData is null", async () => {
    render(
      <Book
        title="Test Book Title"
        coverImageUrl="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdjSJe+8R8ABKECWhMaL4oAAAAASUVORK5CYII="
        goodreadsData={null}
      />,
    );
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.getByText("Rating: Unknown")).toBeVisible();
    expect(screen.getByText("Reviews: Unknown")).toBeVisible();
  });
});
