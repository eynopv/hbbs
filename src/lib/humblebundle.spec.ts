import fs from "fs";
import path from "path";

import { HumbleBundle } from "./humblebundle";

describe("HumbleBundle", () => {
  const mockFetch = jest.fn().mockResolvedValue({
    ok: true,
    text: () =>
      Promise.resolve(
        fs.readFileSync(
          path.resolve(__dirname, "../__tests__/humble.html"),
          "utf8",
        ),
      ),
  } as Response);

  it("fetches bundle", async () => {
    const hb = new HumbleBundle(mockFetch);
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
    const hb = new HumbleBundle(
      jest.fn().mockResolvedValue({
        ok: true,
        text: () =>
          Promise.resolve(`<script id="webpack-bundle-page-data" type="application/json">
                                  {
        "bundleData": {
          "basic_data": {
            "media_type": "not-book"
          }
        }
                                  }
                                  </script>
                                  `),
      }),
    );
    await expect(hb.getBundle("not-book-bundle")).resolves.toBeNull();
  });
});
