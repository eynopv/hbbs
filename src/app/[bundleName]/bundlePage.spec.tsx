import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";

import { server } from "@/mocks/node";
import Page from "./page";

describe("Bundle page", () => {
  let page: BundlePage;

  beforeAll(() => {
    server.listen();
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    page = new BundlePage();
    await page.render();
  });

  afterEach(() => {
    server.resetHandlers();
  });

  it("loads home page", async () => {
    expect(page.bundleTitle).toBeVisible();

    expect(page.bundleRatingSection).toBeVisible();
    expect(page.bundleRatingSectionValue).toHaveTextContent("4.26 / 5");

    expect(page.bundleValueSection).toBeVisible();
    expect(page.bundleValueSectionValue).toHaveTextContent("735 EUR");

    expect(page.itemsSection).toBeVisible();
    expect(page.itemsSectionSections?.length).toBe(3);

    const firstListItem = page.itemsSectionSections
      ? page.itemsSectionSections[0]
      : null;
    const itemTitle = firstListItem?.querySelector("h4");
    expect(itemTitle).toBeVisible();
    expect(itemTitle).toHaveTextContent("Learning GitHub Actions");
  });
});

class BundlePage {
  constructor() {}

  async render() {
    render(
      await Page({
        params: {
          bundleName: "example-bundle",
        },
      }),
    );
  }

  get bundleTitle() {
    return screen.getByRole("heading", { name: "Test Bundle" });
  }

  get bundleRatingSection() {
    return screen
      .getByRole("heading", { name: "Average Rating" })
      .closest("section");
  }

  get bundleRatingSectionValue() {
    return this.bundleRatingSection?.querySelector("p");
  }

  get bundleValueSection() {
    return screen
      .getByRole("heading", { name: "Total Value" })
      .closest("section");
  }

  get bundleValueSectionValue() {
    return this.bundleValueSection?.querySelector("p");
  }

  get rating() {
    return screen.getByTestId("rating");
  }

  get itemsSection() {
    return screen.getByRole("heading", { name: "Books" }).closest("section");
  }

  get itemsSectionSections() {
    return this.itemsSection?.querySelectorAll("section");
  }
}
