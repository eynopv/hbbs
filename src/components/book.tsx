import { BookScoreResult } from "@/lib/goodreads";

export default function Book({
  title,
  coverImageUrl,
  goodreadsData,
}: BookProps) {
  return (
    <section className="flex flex-row gap-x-4 flex-wrap">
      <img
        src={coverImageUrl}
        alt={`${title} - Cover image`}
        className="w-[150px]"
      />
      <div>
        <h4 className="text-xl">
          {goodreadsData ? (
            <a href={goodreadsData.url} className="text-cyan-400">
              {title}
            </a>
          ) : (
            title
          )}
        </h4>
        <p>Rating: {goodreadsData ? goodreadsData.averageRating : "Unknown"}</p>
        <p>Reviews: {goodreadsData ? goodreadsData.ratingsCount : "Unknown"}</p>
      </div>
    </section>
  );
}

type BookProps = {
  title: string;
  coverImageUrl: string;
  goodreadsData: BookScoreResult | null;
};
