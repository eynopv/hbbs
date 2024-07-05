import { parse } from "node-html-parser";

type Fetch = typeof fetch;

export class HumbleBundle {
  constructor(private fetch: Fetch) {}

  async getBundle(bundleName: string): Promise<Bundle | null> {
    const res = await this.fetch(
      `https://www.humblebundle.com/books/${bundleName}`,
      {
        method: "GET",
        next: {
          revalidate: 3600,
        },
      },
    );
    if (!res.ok) {
      console.log("Failed to fetch bundle:", bundleName);
      return null;
    }

    const text = await res.text();
    const html = parse(text);

    const pageData = html
      .getElementsByTagName("script")
      .find((el) => el.getAttribute("id") === "webpack-bundle-page-data");

    if (!pageData) {
      console.log("Failed to find page data on page");
      return null;
    }

    const jsonData = JSON.parse(pageData!.innerText) as PageData;

    if (
      !["ebook", "comic"].includes(jsonData.bundleData.basic_data.media_type)
    ) {
      console.log("Not a book bundle: ", bundleName);
      return null;
    }

    const books = Object.values(jsonData.bundleData.tier_item_data)
      .filter((item: ItemData) => item.item_content_type === "ebook")
      .map((b: ItemData) => ({
        human_name: b.human_name,
        machine_name: b.machine_name,
        item_content_type: b.item_content_type,
        resolved_paths: b.resolved_paths,
      }));

    return {
      human_name: jsonData.bundleData.basic_data.human_name,
      machine_name: jsonData.bundleData.basic_data.machine_name,
      msrp: jsonData.bundleData.basic_data["msrp|money"],
      items: books,
    };
  }
}

export function validateUrl(url: string) {
  try {
    const urlObject = new URL(url);
    return urlObject.host === "www.humblebundle.com";
  } catch {
    return false;
  }
}

type PageData = {
  exchangeRates: Map<string, number>;
  bundleData: {
    basic_data: {
      machine_name: string;
      human_name: string;
      media_type: string | "ebook";
      "msrp|money": {
        currency: "EUR";
        amount: number;
      };
    };
    tier_item_data: Map<string, ItemData>;
  };
};

type ItemData = {
  machine_name: string;
  human_name: string;
  item_content_type: string | "ebook";
  resolved_paths: {
    preview_image_bonus_retina: string | null;
    featured_image: string | null;
    front_page_art_imgix_retina: string | null;
    preview_image_bonus: string | null;
    front_page_art_charity_imgix_retina: string | null;
    front_page_art_imgix: string | null;
    front_page_art_charity_imgix: string | null;
    preview_image: string | null;
  };
};

export type Bundle = {
  human_name: string;
  machine_name: string;
  items: ItemData[];
  msrp: {
    currency: string;
    amount: number;
  };
};
