import toast from "react-hot-toast";
import { PreviewItem } from "./settings/editPostInput";

export const handlePhotoUpload = (
  e: React.ChangeEvent<HTMLInputElement>,
  photoPreview: PreviewItem[],
  setPhotoPreview: React.Dispatch<React.SetStateAction<PreviewItem[]>>,
  setNewPhotos: React.Dispatch<React.SetStateAction<File[]>>,
  setOldPhotos?: React.Dispatch<React.SetStateAction<string[]>>,
  setPhotos?: React.Dispatch<React.SetStateAction<File[]>>
) => {
  const files = e.target.files;

  if (!files) {
    toast.error("Please select a file.");
    return;
  }

  if (photoPreview.length > 4) {
    toast.error("You can upload only 5 photos.");
    return;
  }

  const maxFileSize = 15 * 1024 * 1024;

  Array.from(files).forEach((file) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    if (file.size > maxFileSize) {
      toast.error("File size exceeds the 15MB limit.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPhotoPreview((prev) => [...prev, { src: base64, type: "new" }]);
    };

    reader.readAsDataURL(file);

    if (setPhotos) {
      setPhotos((prev) => [...prev, file]);
    }

    setNewPhotos((prev) => [...prev, file]);
  });

  e.target.value = "";
};
