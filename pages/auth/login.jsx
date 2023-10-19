import { Button, Divider, Form, Input, message } from "antd";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";

import { BiArrowBack } from "react-icons/bi";
import { FcGoogle } from "react-icons/fc";
import { signIn, signOut, useSession } from "next-auth/react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
const Login = () => {
  const [googleIsLoading, setGoogleIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const onFinish = async (values) => {
    try {
      setIsLoading(true);

      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        type: "login",
      });
      if (res?.status === 200) {
        router.push("/");
      } else {
        message.error(res?.error);
      }
    } catch (error) {
      message.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const googleAuth = async () => {
    setGoogleIsLoading(true);
    await signIn("google");
  };

  return (
    <div className='min-h-screen h-fit w-full bg-[url("/assets/auth-bg.jpg")] bg-cover bg-center flex items-center justify-center p-3 py-20'>
      <Head>
        <title>Login</title>
      </Head>
      <Button
        htmltype="button"
        type="link"
        className="text-white absolute top-5 left-5 text-2xl"
      >
        <BiArrowBack onClick={() => router.back()} />
      </Button>

      <div className="bg-mainBlack/30 backdrop-blur-md p-10">
        <div className="text-center font-semibold text-4xl text-white">
          Login
        </div>
        <Form
          name="basic"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label={<label className="text-white">Email</label>}
            name="email"
            className="!text-white"
            rules={[
              {
                type: "email",
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              htmltype="email"
              className="w-[328px] h-[42px] rounded-none"
            />
          </Form.Item>

          <Form.Item
            label={<label className="text-white">Password</label>}
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
          >
            <Input.Password
              htmltype="input"
              className="w-[328px] h-[42px] rounded-none"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="button"
              className="bg-mainDarkRed h-[42px] font-semibold text-white rounded-none w-full"
              htmlType="submit"
              disabled={googleIsLoading || isLoading}
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="text-white mx-auto text-xl animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </Form.Item>
        </Form>
        <Divider className="text-white" plain>
          Or
        </Divider>
        <Button
          htmltype="button"
          onClick={() => {
            googleAuth();
          }}
          className="bg-[#4889f4] p-1   h-[42px] text-white rounded-sm w-full  flex gap-3 items-center "
          type="button"
          disabled={googleIsLoading || isLoading}
        >
          <div className="bg-white left-[2px] absolute h-[90%] flex items-center justify-center text-2xl aspect-square rounded-sm">
            <FcGoogle className="" />
          </div>

          <div className="text-white w-full text-center font-semibold">
            {googleIsLoading ? (
              <AiOutlineLoading3Quarters className="text-white mx-auto text-xl animate-spin" />
            ) : (
              "Sing in with google"
            )}
          </div>
        </Button>
        <div className="text-sm text-center pt-5 text-white">
          Dont have an account?{" "}
          <Link href={"/auth/register"} className="text-blue-500 underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
