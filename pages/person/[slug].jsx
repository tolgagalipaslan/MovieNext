import Banner from "@/components/PersonDetails/Banner";
import axios from "axios";
import Head from "next/head";
import React from "react";

const PersonDetails = ({ person, personDetails }) => {
  return (
    <div>
      <Head>
        <title>{person?.name || "Ofenos"}</title>
      </Head>
      <div className="fixed left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-[-1] w-[80vh] aspect-square rounded-full blur-[150px] bg-mainWhite/50"></div>
      <Banner person={person} personDetails={personDetails} />
    </div>
  );
};

export default PersonDetails;

export const getServerSideProps = async (context) => {
  const name = context.query.slug.replace(/-/g, " ");

  try {
    const personRes = await axios.get(
      `https://api.themoviedb.org/3/search/person?include_adult=false&language=en-US&page=1&query=${name}&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );
    const personPopulatedRes = await axios.get(
      `https://api.themoviedb.org/3/person/${personRes?.data?.results[0]?.id}?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_KEY}`
    );

    return {
      props: {
        person: personRes?.data?.results[0],
        personDetails: personPopulatedRes?.data,
      },
    };
  } catch (error) {
    return {
      props: {
        person: [],
        personDetails: [],
      },
    };
  }
};
