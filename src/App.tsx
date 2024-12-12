import { ChatButton } from './components/chat/ChatButton';
import { ChatWindow } from './components/chat/ChatWindow';
import { ErrorBoundary } from './components/common/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Anxius | AI Customer Service Chat Demo
            </h1>
            <p className="text-lg text-gray-600">
              Click the chat button in the bottom right corner to start a conversation.
            </p>
          </div>
        </div>
        <ChatButton />
        <ChatWindow />
      </div>
    </ErrorBoundary>
  );
}

export default App;