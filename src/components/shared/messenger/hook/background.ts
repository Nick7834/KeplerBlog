import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export const useBackground = (
  userId: string,
  customBackgroundChat: string | null,
  setBackgroundChat: (url: string) => void,
  setFilePreview: (url: string | null) => void,
) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleBackground = async (url: string | null) => {
    if (!url) {
      const confirm = window.confirm(
        "Are you sure you want to reset the background?"
      );

      if (!confirm) {
        return;
      }

      setFilePreview(null);
    }
    setBackgroundChat(url || "");
    try {
      const resp = await axios.put(
        `/api/messenger/background?background=${url || ""}`
      );

      if (resp.status === 200) {
        toast.success("Background changed successfully");
        queryClient.invalidateQueries({
          queryKey: ["background-chat", userId],
        });
      }
    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong");
    }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileCustom = e.target.files?.[0];

    e.target.value = "";

    if (fileCustom && fileCustom.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds the 5MB limit.");
      return;
    }

    if (fileCustom && !fileCustom.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (fileCustom) {
      setFilePreview(URL.createObjectURL(fileCustom));
      handleUploadCustomPhoto(fileCustom);
    }
  };

  const handleUploadCustomPhoto = async (fileCustom: File) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", fileCustom);
    formData.append("oldBackground", customBackgroundChat || "");

    try {
      const resp = await axios.patch(
        "/api/messenger/customBackground",
        formData
      );
      if (resp.status === 200) {
        setFilePreview(resp.data.backgroundChat);
        setBackgroundChat(resp.data.backgroundChat);
        queryClient.invalidateQueries({
          queryKey: ["background-chat", userId],
        });
        toast.success("Photo uploaded successfully");

        setLoading(false);
      }
    } catch (error) {
      console.warn(error);
      toast.error("Something went wrong");
    }
  };

  return { handleBackground, handleFile, loading };
};
