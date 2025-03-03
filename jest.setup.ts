import { prisma } from "@/prisma/prisma-client";

afterAll(async () => {
  await prisma.$disconnect(); 
});

jest.mock("@/lib/autch", () => ({
  getUserSession: jest.fn().mockResolvedValue({ id: "userId2" }),
}));