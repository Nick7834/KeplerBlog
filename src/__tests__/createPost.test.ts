// import { POST } from "../app/api/posts/route";
// import { prisma } from "../prisma/prisma-client";

// describe('createPost', () => {

//     let createPostId: string | null = null;

//     afterAll(async () => {
//         if(createPostId) {
//             await prisma.post.delete({ where: { id: createPostId } });
//         }
//     });

//     it('should create a post', async () => {

//         const formData = new FormData();
//         formData.append('title', 'Test Post');
//         formData.append('content', JSON.stringify({ text: 'Test content' }));

//         (global as any).getUserSession = jest.fn().mockResolvedValue({ id: 'userId2' });

//         const request  = new Request('http://localhost:3000/api/posts', {
//             method: 'POST',
//             body: formData,
//         });

//         const response = await POST(request); 
//         const data = await response.json(); 

//         expect(data.status).toBe(200);
//         expect(data.message).toBe('Post created successfully');

//         const savedPost = await prisma.post.findFirst({ where: { id: data.id } });
//         expect(savedPost).not.toBeNull();

//         if(savedPost) {
//             createPostId = savedPost.id
//         }

//     })



// })