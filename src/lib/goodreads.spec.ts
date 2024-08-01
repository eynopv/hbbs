import { server } from "@/mocks/node";
import { Goodreads, removeEdition } from "./goodreads";

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

describe("removeEdition", () => {
  it("it should return same name", async () => {
    expect(removeEdition("My Book")).toBe("My Book");
  });

  it("it should remove Xst edition", () => {
    expect(removeEdition("My Book, 1st edition")).toBe("My Book");
  });

  it("it should remove Xnd edition", () => {
    expect(removeEdition("My Book, 2nd edition")).toBe("My Book");
  });

  it("it should remove Xrd edition", () => {
    expect(removeEdition("My Book, 3rd edition")).toBe("My Book");
  });

  it("it should remove Xth edition", () => {
    expect(removeEdition("My Book, 4th edition")).toBe("My Book");
  });
});
