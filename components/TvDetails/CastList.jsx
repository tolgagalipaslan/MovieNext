import Title from "../ui/Title";
import Link from "next/link";

const CastList = ({ cast }) => {
  return (
    <div className="overflow-hidden py-10">
      {cast?.cast?.length !== 0 ? (
        <div className="container">
          <Title>Top Billed Cast</Title>
          <div className="flex gap-5 container overflow-auto pb-2 castlist-scroll ">
            {cast?.cast?.map(
              (cast, i) =>
                cast?.profile_path && (
                  <Link
                    href={`/person/${cast?.name
                      ?.toLowerCase()
                      .replace(/ /g, "-")}`}
                    key={i}
                  >
                    <div
                      style={{
                        backgroundImage: `url(https://www.themoviedb.org/t/p/w300_and_h450_bestv2/${cast?.profile_path})`,
                      }}
                      className="h-[231px] aspect-[9/12] bg-cover bg-center rounded-md"
                    ></div>
                  </Link>
                )
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default CastList;
