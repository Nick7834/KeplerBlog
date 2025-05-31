import { ChatRequest, Message } from "@prisma/client";

export interface MessageProps extends Message {
  message: MessageProps;
  isNew?: boolean;
  replyTo: {
    id: string;
    content: string;
    image: string;
    sender: {
      username: string;
    }
  }
}

export interface ImessageData {
  pages: {
    messages: Message[]
  }[]
}

export interface ChatProps extends Chat {
  unreadCount: number;
  chatId: string;
  chats: MessageProps[];
  lastActivityAt: Date;
  isRead: boolean;
  companion: {
      id: string,
      profileImage: string,
      username: string
  },
  user1: {
    id: string;
    username: string;
    profileImage: string;
  };
  user2: {
    id: string;
    username: string;
    profileImage: string;
  };
}

export interface IchatsData {
    pages: {
        totalChats: number;
        chats: ChatProps[]
    }[]
}

export interface ReplyType {
  id: string;
  content: string;
  image: string;
  sender: {
    username: string;
  };
  optimistic?: boolean;
}

export interface Chat {
  interlocutor: {
    id: string;
    username: string;
    profileImage: string;
    isverified: true
  };
  id: string;
}

export interface RequestChat {
  pages: {
    items: ChatRequest[]
  }[]
}