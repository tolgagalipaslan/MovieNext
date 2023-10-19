// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  const { email } = req.body;

  if (!email) {
    return res
      .status(500)
      .json({ message: "Please fill all the form", valid: false });
  }

  const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  if (!regex.test(email)) {
    return res
      .status(200)
      .json({ message: "This email is not real", valid: false });
  }

  await dbConnect();

  const existUser = await User.findOne({ email: email });
  if (existUser) {
    return res
      .status(200)
      .json({ message: "This email is already use", valid: false });
  }

  return res
    .status(200)
    .json({ message: "This email is receivable", valid: true });
}
