import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  AiFillHome,
  AiFillLinkedin,
  AiFillPhone,
  AiOutlineGithub,
  AiOutlineGoogle,
  AiOutlineMail,
  AiOutlinePrinter,
  AiOutlineTwitter,
} from "react-icons/ai";
import { BsInstagram } from "react-icons/bs";

import { FaFacebookF } from "react-icons/fa";
function Footer() {
  const { pathname } = useRouter();
  const hideFooter =
    pathname === "/404" ||
    pathname === "/auth/login" ||
    pathname === "/auth/register";
  return (
    <div className={`bg-gray-800 text-white ${hideFooter ? "hidden" : ""}  mt-5`}>
      {/* <section className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          <div className="mb-4">
            <Link href={"/"} className="flex items-center gap-2">
              <div className="relative w-[50px] aspect-square flex items-center gap-0">
                <Image
                  className="object-contain"
                  fill
                  src={"/assets/logo1.png"}
                  alt="Ofenos"
                />
              </div>
              <h6 className=" text-transparent bg-clip-text bg-gradient-to-b text-3xl font-extrabold from-mainWhite to-mainDarkRed ml-[-5px]">
                Ofenos
              </h6>
            </Link>
            <hr className="mb-4 mt-0 border-t-2 border-mainDarkRed" />
            <p>
              Here you can use rows and columns to organize your footer content.
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </p>
          </div>

          <div className="mb-4">
            <h6 className="text-xl font-bold h-[50px] flex items-center">
              Products
            </h6>
            <hr className="mb-4  border-t-2 border-mainDarkRed" />
            <p>
              <a href="#!" className="text-white">
                MDBootstrap
              </a>
            </p>
            <p>
              <a href="#!" className="text-white">
                MDWordPress
              </a>
            </p>
            <p>
              <a href="#!" className="text-white">
                BrandFlow
              </a>
            </p>
            <p>
              <a href="#!" className="text-white">
                Bootstrap Angular
              </a>
            </p>
          </div>

          <div className="mb-4">
            <h6 className="text-xl font-bold h-[50px] flex items-center">
              Useful links
            </h6>
            <hr className="mb-4  border-t-2 border-mainDarkRed" />
            <p>
              <a href="#!" className="text-white">
                Your Account
              </a>
            </p>
            <p>
              <a href="#!" className="text-white">
                Become an Affiliate
              </a>
            </p>
            <p>
              <a href="/faq" className="text-white">
                F.A.Q
              </a>
            </p>
            <p>
              <a href="#!" className="text-white">
                Help
              </a>
            </p>
          </div>

          <div className="mb-4">
            <h6 className="text-xl font-bold h-[50px] flex items-center">
              Contact
            </h6>
            <hr className="mb-4 border-t-2 border-mainDarkRed" />
            <p className="flex items-center gap-2">
              <AiFillHome /> New York, NY 10012, US
            </p>
            <p className="flex items-center gap-2">
              <AiOutlineMail /> info@example.com
            </p>
            <p className="flex items-center gap-2">
              <AiFillPhone /> + 01 234 567 88
            </p>
            <p className="flex items-center gap-2">
              <AiOutlinePrinter /> + 01 234 567 89
            </p>
          </div>
        </div>
      </section> */}

      <div className="bg-mainBlack2">
        <div className="flex container items-center justify-between">
          <div className="text-center py-3 bg-opacity-20 ">
            © 2020 Copyright :{" "}
            <a className="text-white" href="https://mdbootstrap.com/">
              Ofenos.com
            </a>
          </div>

          <div className="flex items-center ">
            <a href="#" className="text-white me-4">
              <FaFacebookF />
            </a>
            <a href="#" className="text-white me-4">
              <AiOutlineTwitter />
            </a>
            <a href="#" className="text-white me-4">
              <BsInstagram />
            </a>
            <a href="#" className="text-white me-4">
              <AiOutlineGoogle />
            </a>
            <a href="#" className="text-white me-4">
              <AiFillLinkedin />
            </a>
            <a href="#" className="text-white me-4">
              <AiOutlineGithub />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
