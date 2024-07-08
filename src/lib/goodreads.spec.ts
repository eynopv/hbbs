import { server } from "@/mocks/node";
import { Goodreads } from "./goodreads";

describe("Goodreads", () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it("should fetch data for the book", async () => {
    const gr = new Goodreads();
    const score = await gr.getBookScore("Learning GitHub Actions");
    expect(score).toMatchObject({
      averageRating: 4.26,
      ratingsCount: 900,
    });
  });
});
