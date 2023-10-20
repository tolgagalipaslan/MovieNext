import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const handler = async (req, res) => {
  await dbConnect();
  const { method } = req;
  if (method === "GET") {
    const user = await User.find();
    res.status(200).json(user);
  } else if (method === "POST") {
  } else if (method === "DELETE") {
  } else {
    return res.status(400).json({
      message: "Method Not Allowed",
    });
  }
};

export default handler;
