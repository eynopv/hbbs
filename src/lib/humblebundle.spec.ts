import { server } from "@/mocks/node";
import { HumbleBundle } from "./humblebundle";

describe("HumbleBundle", () => {
  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it("fetches bundle", async () => {
    const hb = new HumbleBundle();
    const bundle = await hb.getBundle("example-bundle");
    expect(bundle).toMatchObject({
      human_name: "Test Bundle",
      items: [
        {
          human_name: "Learning GitHub Actions",
        },
        {
          human_name: "Efficient Linux at the Command Line",
        },
        {
          human_name: "Practical Linux System Administration",
        },
      ],
    });
  });

  it("returns null on non book bundle", async () => {
    const hb = new HumbleBundle();
    await expect(hb.getBundle("not-book-bundle")).resolves.toBeNull();
  });
});
