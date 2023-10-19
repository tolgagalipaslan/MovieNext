import axios from "axios";

const ToggleFavoriteListItem = async (userId, item) => {
  try {
    const res = await axios.post(`/api/favoriteList`, {
      userId: userId,
      item: item,
    });

    return res?.data?.favoriteList;
  } catch (error) {
    console.log(error);
  }
};

export default ToggleFavoriteListItem;
