import axios from "axios";

interface Settings {
  backgroundColor?: string;
  textColor?: string;
  fontSize?: string;
  radiusSize?: string;
}

export const settingsUpdate = async (data: Settings) => {
  await axios.patch("/api/messenger/settings", data);
};
