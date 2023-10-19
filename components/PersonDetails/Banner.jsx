import { Button } from "antd";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Banner = ({ person, personDetails }) => {
  const [showMore, setShowMore] = useState(false);
  const paragraphs = personDetails?.biography.split("\n\n");

  const limitedParagraphs = showMore ? paragraphs : paragraphs.slice(0, 2);

  const calculateAge = (birthdate) => {
    const birthDate = new Date(birthdate);
    const currentDate = new Date();

    var age = currentDate.getFullYear() - birthDate.getFullYear();

    // Doğum günü bu yıl geçmediyse yaşını bir azalt
    if (
      currentDate.getMonth() < birthDate.getMonth() ||
      (currentDate.getMonth() === birthDate.getMonth() &&
        currentDate.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="h-fit py-5  w-full    bg-[url('/assets/auth-bg.jpg')] -mt-[65px] pt-[65px] bg-cover bg-center">
      <div className="container  bg-mainBlack2/80 p-3 md:p-5 rounded-2xl">
        <div className="flex flex-col md:flex-row w-full text-white gap-5">
          <div className="flex flex-col gap-5">
            <div className="relative mx-auto md:mx-0 rounded-2xl overflow-hidden h-fit aspect-square md:aspect-[4/6] w-[200px] md:min-w-[300px] ">
              <Image
                fill
                className="object-cover object-center md:object-fill  "
                src={`${
                  person?.profile_path
                    ? `https://www.themoviedb.org/t/p/w600_and_h900_bestv2/${person?.profile_path}`
                    : "/assets/default-img.png"
                }`}
                alt={person?.name}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="text-2xl  ">Personal Info</div>
              <div className="flex flex-col ">
                <div className="font-semibold">Known For</div>
                <div className="text-sm font-[300]">
                  {personDetails?.known_for_department}
                </div>
              </div>{" "}
              <div className="flex flex-col ">
                <div className="font-semibold">Gender</div>
                <div className="text-sm font-[300]">
                  {person?.gender === 2 ? "Male" : "Female"}
                </div>
              </div>{" "}
              {personDetails?.birthday && (
                <div className="flex flex-col ">
                  <div className="font-semibold">Birthday</div>
                  <div className="text-sm font-[300]">
                    {personDetails?.birthday} (
                    {calculateAge(personDetails?.birthday)} Years Old)
                  </div>
                </div>
              )}
              {personDetails?.place_of_birth && (
                <div className="flex flex-col ">
                  <div className="font-semibold">Place of Birth</div>
                  <div className="text-sm font-[300]">
                    {personDetails?.place_of_birth}
                  </div>
                </div>
              )}
              {personDetails?.also_known_as?.length !== 0 && (
                <div className="flex flex-col ">
                  <div className="font-semibold">Also Known As</div>
                  {personDetails?.also_known_as?.map((item, i) => (
                    <div key={i} className="text-sm font-[300]">
                      {item}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-10 w-full">
            <div className="text-3xl font-semibold ">{person?.name}</div>
            <div className="flex flex-col gap-3">
              <div className="text-2xl">Biography</div>
              {personDetails?.biography ? (
                <div className="flex flex-col gap-5 italic">
                  {limitedParagraphs.map((paragraph, index) => (
                    <div key={index}>{paragraph}</div>
                  ))}

                  {/* "read more" düğmesini göstermek için koşul ekleyin */}
                  {paragraphs.length > 2 && (
                    <div className="flex items-center justify-end">
                      <Button
                        type="link"
                        onClick={() => setShowMore(!showMore)}
                        className="text-blue-500 hover:underline cursor-pointer"
                      >
                        {showMore ? "Show less " : "Read more "}
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                " This information is unfortunately not available"
              )}
            </div>

            {person?.known_for?.length !== 0 ? (
              <div className="flex flex-col gap-2  mt-auto">
                <div className="text-2xl">Known For</div>
                <div className="flex gap-3">
                  {person?.known_for?.map((item, i) => (
                    <Link
                      href={`${
                        item?.media_type === "movie"
                          ? `/movie-details/${item?.id}-${item?.title
                              ?.toLowerCase()
                              .replace(/ /g, "-")}`
                          : item?.media_type === "tv"
                          ? `/movie-details/${item?.id}-${item?.title
                              ?.toLowerCase()
                              .replace(/ /g, "-")}`
                          : null
                      }`}
                      key={i}
                      className="bg-cover w-full bg-center aspect-[9/14] rounded-2xl"
                      style={{
                        backgroundImage: `url(https://image.tmdb.org/t/p/w600_and_h900_bestv2/${item?.poster_path})`,
                      }}
                    ></Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
