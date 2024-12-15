import { ChatContainer } from "./chat/ChatContainer";

export const Chat = () => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-background to-background/90">
      <ChatContainer />
    </div>
  );
};