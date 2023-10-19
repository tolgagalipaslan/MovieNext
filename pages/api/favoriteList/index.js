import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const handler = async (req, res) => {
  const { method } = req;
  const { queryId } = req.query;
  const { userId, item } = req.body;
  await dbConnect();
  if (method === "GET") {
    const user = await User.findById(queryId);

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    return res.status(200).json({ favoriteList: user?.favoriteList });
  } else if (method === "POST") {
    const user = await User.findById(userId);

    const oldBasket = user?.favoriteList;

    const itemIsExist = oldBasket.find((i) => i.id === item.id);
    if (itemIsExist) {
      const newBasket = oldBasket?.filter((i) => i.id !== item?.id);
      const updatedData = await User.findByIdAndUpdate(
        user._id,
        { favoriteList: newBasket },
        { new: true }
      );

      return res.status(200).json({ favoriteList: updatedData?.favoriteList });
    } else {
      const newBasket = [item, ...oldBasket];
      const updatedData = await User.findByIdAndUpdate(
        user._id,
        { favoriteList: newBasket },
        { new: true }
      );

      return res.status(200).json({ favoriteList: updatedData?.favoriteList });
    }
  }
  return res.status(500).json({ message: "Something went wrong!" });
};

export default handler;
