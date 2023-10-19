import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export default async function handler(req, res) {
  const { userId, itemId } = req.body;

  if (!userId || !itemId) {
    return res
      .status(500)
      .json({ message: "Please fill all the form", exist: false });
  }

  await dbConnect();

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found", exist: false });
  }

  const findItem = user?.watchList.find((i) => i.id === itemId);

  if (findItem) {
    return res.status(200).json({ exist: true });
  } else {
    return res.status(200).json({ exist: false });
  }
}
