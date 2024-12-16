export const FetchImagesAsFiles = async (urls: string[]): Promise<File[]> => {
   const files = await Promise.all(
       urls.map(async (url) => {
           
           const response = await fetch(url);
           const blob = await response.blob();

           const fileName = url.split('/').pop() || 'unknown-file';
           
           return new File([blob], fileName, { type: blob.type });

       })
   )

   return files
};