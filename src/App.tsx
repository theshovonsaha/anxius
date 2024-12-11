
import { ChatButton } from './components/ChatButton';
import { ChatWindow } from './components/ChatWindow';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">Anxius Demo</h1>
        <p className="text-gray-600">
          Click the chat button in the bottom right corner to start a conversation.
        </p>
      </div>
      <ChatButton />
      <ChatWindow />
    </div>
  );
}

export default App;