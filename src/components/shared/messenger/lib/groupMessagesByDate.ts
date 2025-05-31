import { MessageProps } from "@/@types/message";

type ChatItem = 
  | { type: "date"; date: string }
  | { type: "message"; message: MessageProps };

export const groupMessagesByDate = (messages: MessageProps[]): ChatItem[] => {
  const result: ChatItem[] = [];

  let lastDate = "";

  for (const msg of messages) {
    const currentDate = new Date(msg.createdAt).toDateString();

    if (currentDate !== lastDate) {
      result.push({ type: "date", date: currentDate });
      lastDate = currentDate;
    }

    result.push({ type: "message", message: msg });
  }

  return result;
};