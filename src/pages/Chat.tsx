import ChatInterface from "@/components/ChatInterface";
import MetricsSidebar from "@/components/MetricsSidebar";

const Chat = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      <div className="flex-1 glass-panel rounded-xl overflow-hidden">
        <ChatInterface />
      </div>
      <div className="hidden lg:block">
        <MetricsSidebar />
      </div>
    </div>
  );
};

export default Chat;
