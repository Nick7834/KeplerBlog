# KeplerBlog

KeplerBlog is a modern blogging platform where users can share their ideas, discuss posts, and build communities. With a sleek interface, dark/light theme support, and tons of convenient features, this blog is the perfect place for creativity and communication.

---

### 🚀 **Features:**

- **📝 Post Creation & Editing**  
  Create and edit posts, including text and images (up to 5 images, 15MB each), with a mini-editor for content formatting.

- **💬 Comments**  
  Post comments with replies and create a nested comment tree for engaging discussions.

- **🔔 Notifications**  
  Get real-time notifications about new posts and replies to your comments.

- **👥 Subscriptions**  
  Subscribe to users and posts to stay updated on fresh content.

- **📷 Image Upload**  
  Upload up to 5 images per post (15MB per image).

- **⚡ Adaptive Interface**  
  Seamlessly switch between dark and light themes for a personalized experience.

- **🖼️ Image Slider**  
  View post images in a slider that opens them in fullscreen mode when clicked.

- **💡 Skeletons**  
  A smooth and beautiful loading animation for content loading.

- **💬 Real-time Messenger (KeplerMessenger)**  
  A fully featured chat system with real-time messaging and image sharing.  
  - Send, edit, delete, reply to, and copy messages instantly.  
  - Messages and changes appear live for both users.  
  - Virtualized chat with infinite scroll loading older messages.  
  - Automatic scroll management on sending and receiving messages.  
  - Chat auto-scrolls to newest messages when typing or receiving new messages.  
  - Real-time updates for chat status and message read receipts via Redis.  
  - Unread message counters with clear indicators upon reading.  
  - Instant synchronization of request statuses (accepted/declined) in real time.  
  - Efficient cache management updating on new messages.

---

### 💻 **Tech Stack:**

- **Next.js** — Server-side rendering and React development.  
- **Prisma** — Database interaction.  
- **NextAuth** — Authentication via Google, GitHub, and email.  
- **React Hook Form** & **Zod** — Form handling and validation.  
- **Swiper.js** — For creating image sliders.  
- **Zustand** — Global state management.  
- **Pusher** — Real-time notifications.  
- **Redis** & **BullMQ** — Background tasks and task queues.  
- **Cloud Storage (C Storage)** — For image storage.