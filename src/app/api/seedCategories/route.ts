// import { prisma } from "@/prisma/prisma-client";
// import { NextResponse } from "next/server";

// // const categories = [
// //   { name: "Anime & Cosplay", slug: "anime-cosplay", icon: "faFaceGrinStars" },
// //   {
// //     name: "Business & Finance",
// //     slug: "business-finance",
// //     icon: "faDollarSign",
// //   },
// //   { name: "Q&A", slug: "qna", icon: "faQuestionCircle" },
// //   { name: "Humanities & Law", slug: "humanities-law", icon: "faBook" },
// //   { name: "Home & Garden", slug: "home-garden", icon: "faHouse" },
// //   { name: "Food & Drinks", slug: "food-drinks", icon: "faUtensils" },
// //   { name: "Health & Fitness", slug: "health-fitness", icon: "faHeartPulse" },
// //   { name: "Games", slug: "games", icon: "faGamepad" },
// //   { name: "Art", slug: "art", icon: "faPaintBrush" },
// //   { name: "Movies & TV", slug: "movies-tv", icon: "faFilm" },
// //   { name: "Music", slug: "music", icon: "faMusic" },
// //   { name: "Science", slug: "science", icon: "faFlask" },
// //   { name: "News & Politics", slug: "news-politics", icon: "faNewspaper" },
// //   {
// //     name: "Education & Career",
// //     slug: "education-career",
// //     icon: "faGraduationCap",
// //   },
// //   { name: "Pop Culture", slug: "pop-culture", icon: "faStar" },
// //   { name: "Nature & Leisure", slug: "nature", icon: "faTree" },
// //   { name: "Travel", slug: "travel", icon: "faPlane" },
// //   { name: "Sports", slug: "sports", icon: "faFootball" },
// //   { name: "Technology", slug: "technology", icon: "faLaptop" },
// //   { name: "Transport", slug: "transport", icon: "faCar" },
// //   { name: "Reading & Writing", slug: "reading-writing", icon: "faPenFancy" },
// //   { name: "Adult", slug: "adult", icon: "faCircleExclamation" },
// //   { name: "Internet Culture", slug: "internet-culture", icon: "faGlobe" },
// //   {
// //     name: "Identity & Relationships",
// //     slug: "identity-relationships",
// //     icon: "faUser",
// //   },
// //   { name: "Fashion & Beauty", slug: "fashion-beauty", icon: "faTshirt" },
// //   { name: "Collecting & Hobbies", slug: "hobbies", icon: "faPuzzlePiece" },
// //   { name: "Horror", slug: "horror", icon: "faGhost" },
// //   { name: "Horror Movies & Mysteries", slug: "horror-movies", icon: "faSkull" },
// //   { name: "Social Media", slug: "social-media", icon: "faUsers" },
// //   { name: "Financial Tips", slug: "financial-tips", icon: "faCoins" },
// //   { name: "Natural Sciences", slug: "natural-sciences", icon: "faLeaf" },
// //   { name: "Cooking", slug: "cooking", icon: "faBowlFood" },
// //   { name: "Philosophy & Thoughts", slug: "philosophy", icon: "faBrain" },
// //   { name: "Cars & Tech", slug: "cars-tech", icon: "faCarSide" },
// //   { name: "Psychology", slug: "psychology", icon: "faFaceSmileBeam" },
// // ];

// export async function POST(request: Request) {
//   try {
//     // const createdCategories = [];

//     // for (const category of categories) {
//     //   const cat = await prisma.category.upsert({
//     //     where: { slug: category.slug },
//     //     update: {},
//     //     create: {
//     //       name: category.name,
//     //       slug: category.slug,
//     //       icon: category.icon,
//     //     },
//     //   });
//     //   createdCategories.push(cat);
//     // }

//     // const uncategorized = await prisma.category.upsert({
//     //   where: { slug: "uncategorized" },
//     //   update: {},
//     //   create: {
//     //     name: "Uncategorized",
//     //     slug: "uncategorized",
//     //     icon: "faFolder",
//     //   },
//     // });

//     // await prisma.post.updateMany({
//     //   where: { },
//     //   data: { categoryId: uncategorized.id },
//     // });

//     await prisma.category.upsert({
//       where: { slug: "entertainment" },
//       update: {
//         icon: "faTheaterMasks", // Иконка для обновления
//       },
//       create: {
//         name: "Entertainment",
//         slug: "entertainment",
//         icon: "faTheaterMasks", // Иконка для новой категории, если она не найдена
//       },
//     });

//     return NextResponse.json({ message: "Categories seeded successfully" });
//   } catch {
//     return NextResponse.json(
//       { error: "Something went wrong" },
//       { status: 500 }
//     );
//   }
// }
