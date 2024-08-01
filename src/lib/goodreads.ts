import { parse } from "node-html-parser";

export class Goodreads {
  async getBookScore(bookName: string): Promise<BookScoreResult | null> {
    const res = await fetch(
      `https://www.goodreads.com/search?utf8=%E2%9C%93&q=${encodeURIComponent(bookName)}`,
      {
        method: "GET",
        next: {
          revalidate: 3600 * 24,
        },
      },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch");
    }

    const text = await res.text();
    const html = parse(text);
    const bookRow = html.querySelector("tr");

    if (!bookRow) {
      console.log("Book not found: " + bookName);
      return null;
    }

    const rating = bookRow.querySelector(".minirating");
    const link = bookRow.querySelector("a")?.getAttribute("href");

    if (!rating || !link) {
      return null;
    }

    const [scoreString, countString] = rating.innerText.split(";");
    const score = parseFloat(scoreString);
    const count = parseInt(countString);

    return {
      url: `https://www.goodreads.com${link}`,
      averageRating: score,
      ratingsCount: count,
    };
  }
}

export type BookScoreResult = {
  url: string;
  averageRating: number;
  ratingsCount: number;
};
