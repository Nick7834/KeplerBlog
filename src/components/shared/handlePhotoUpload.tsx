import toast from "react-hot-toast";

export const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    photoPreview: string[],
    setPhotoPreview: React.Dispatch<React.SetStateAction<string[]>>,
    setNewPhotos: React.Dispatch<React.SetStateAction<File[]>>,
    setOldPhotos?: React.Dispatch<React.SetStateAction<string[]>>,
    setPhotos?: React.Dispatch<React.SetStateAction<File[]>>,
) => {
    const files = e.target.files;

    if (!files) {
        toast.error('Please select a file.');
        return;
    }

    if(photoPreview.length > 4) {
        toast.error('You can upload only 5 photos.');
        return;
    }

    const maxFileSize = 15 * 1024 * 1024; 

    Array.from(files).forEach((file) => {
        if(!file.type.startsWith('image/')) {
            toast.error('Please select an image file.');
            return;
        }

        if (file.size > maxFileSize) {
          toast.error("File size exceeds the 15MB limit.");
          return;
        }

        const reader = new FileReader();
        
        reader.onloadend = () => {
          setPhotoPreview((prev) => [...prev, reader.result as string]); 
        };
        
        reader.readAsDataURL(file);
        
        if (setPhotos) {
            setPhotos((prev) => [...prev, file]);
        }

        setNewPhotos((prev) => [...prev, file]);
    });

    e.target.value = '';
}