import axios from "axios";

const IsItemExist = async (userId, itemId) => {
  try {
    const res = await axios.post(`/api/isItemExist`, {
      userId,
      itemId,
    });

    return res?.data?.exist;
  } catch (error) {
    console.log(error);
  }
};

export default IsItemExist;
