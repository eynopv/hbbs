import { Goodreads, type BookScoreResult } from "@/lib/goodreads";
import { HumbleBundle } from "@/lib/humblebundle";
import Book from "@/components/book";

// Revalidate cache at most every hour
export const revalidate = 3600;

type PageProps = {
  params: {
    bundleName: string;
  };
};

export default async function Page({ params: { bundleName } }: PageProps) {
  const hb = new HumbleBundle(fetch);
  const gr = new Goodreads(fetch);
  const bundle = await hb.getBundle(bundleName);

  const goodreadsResults: { [key: string]: BookScoreResult } = {};
  await Promise.all(
    bundle.items.map(async (item) => {
      try {
        const score = await gr.getBookScore(item.human_name);
        if (score?.averageRating) {
          goodreadsResults[item.machine_name] = score;
        }
      } catch (err) {
        console.error(err);
      }
    }),
  );

  function calculateAverage(numbers: number[]): number {
    const validNumbers = numbers.filter((n) => n !== null && !isNaN(n));
    const sum = validNumbers.reduce((acc, num) => acc + num, 0);
    return sum / validNumbers.length;
  }

  return (
    <main>
      <article>
        <h2 className="text-2xl">{bundle.human_name}</h2>

        <div className="mt-6 mb-8 flex flex-row gap-x-8">
          <section>
            <h3 className="text-xl">Average Rating</h3>
            <p>
              {calculateAverage(
                Object.values(goodreadsResults).map((r) => r.averageRating),
              ).toFixed(2)}{" "}
              / 5
            </p>
          </section>

          <section>
            <h3 className="text-xl">Total Value</h3>
            <p>
              {Math.round(bundle.msrp.amount)} {bundle.msrp.currency}
            </p>
          </section>
        </div>

        <section>
          <h3 className="hidden">Books</h3>
          <div className="mt-4 flex flex-col gap-y-4">
            {bundle.items.map((b) => (
              <Book
                key={b.machine_name}
                title={b.human_name}
                coverImageUrl={b.resolved_paths.front_page_art_imgix || ""}
                goodreadsData={
                  goodreadsResults[b.machine_name]
                    ? goodreadsResults[b.machine_name]
                    : null
                }
              />
            ))}
          </div>
        </section>
      </article>
    </main>
  );
}
