// import { IPost } from "@/@types/post";
// import { useEffect, useRef } from "react";

// const useScrollToTop = (isLoading: boolean, posts: IPost[]) => {
//   const hasScrolled = useRef(false); // Проверка, был ли уже выполнен скролл

//   useEffect(() => {
//     if (isLoading || hasScrolled.current || posts.length > 0) return; // Если загружается контент или уже был выполнен скролл

//     // Прокручиваем в начало при первой загрузке страницы
//     setTimeout(() => {
//       window.scrollTo({ top: 0, behavior: "instant" });
//       hasScrolled.current = true; // Устанавливаем флаг, что скролл выполнен
//     }, 100);
//   }, [isLoading, posts]); // Эффект срабатывает при изменении данных или загрузки
// };

// export default useScrollToTop;