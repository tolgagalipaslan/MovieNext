import { Button } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

const NotFoundPage = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-[url('/assets/auth-bg.jpg')] bg-center bg-cover flex items-center justify-center md:p-5 p-3">
      <Head>
        <title>Ofenos Movies</title>
      </Head>
      <div className="flex flex-col item gap-4">
        <div className="text-[150px] md:text-[250px] text-center from-[#544a7d] to-[#ffd452]   text-transparent bg-clip-text bg-gradient-to-r -my-10 md:-my-20">
          404
        </div>
        <div className="text-lg text-white text-center">
          You sure look lost but its okay it can happen to anyone.
        </div>{" "}
        <div className="text-md text-gray-300/90 max-w-[500px] text-center">
          404 Not Found is an HTTP response code that indicates a web page
          cannot be located on the server. This error often results from an
          incorrect URL or a request for a non-existent page.
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            type="button"
            shape="round"
            size="large"
            className="bg-mainDarkRed text-white "
            onClick={() => router.back()}
          >
            Back
          </Button>
          <Link href={"/"}>
            <Button
              type="button"
              shape="round"
              size="large"
              className="bg-transparent text-white  border-white"
            >
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
