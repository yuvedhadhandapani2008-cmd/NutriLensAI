import axios from "axios";

const API_KEY = process.env.EXPO_PUBLIC_ROBOFLOW_API_KEY;

export const detectFood = async (imageUri) => {
  try {
    const formData = new FormData();

    formData.append("file", {
      uri: imageUri,
      name: "food.jpg",
      type: "image/jpeg",
    });

    const response = await axios.post(
      `https://detect.roboflow.com/food-detection/2?api_key=${API_KEY}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response.data);

    const predictions =
      response.data.predictions;

    if (
      predictions &&
      predictions.length > 0
    ) {
      return predictions[0].class;
    }

    return "food";
  } catch (error) {
    console.log(error);

    return "food";
  }
};