import axios from "axios";

const ToggleWatchlistItem = async (userId, item) => {
  try {
    const res = await axios.post(`/api/watchList`, {
      userId: userId,
      item: item,
    });

    return res?.data?.watchList;
  } catch (error) {
    console.log(error);
  }
};

export default ToggleWatchlistItem;
