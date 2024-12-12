import { Routes, Route, Link } from 'react-router-dom';
import { ChatButton } from './components/chat/ChatButton';
import { ChatWindow } from './components/chat/ChatWindow';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ChevronRight } from 'lucide-react';
import SetupInstructions from './pages/SetupInstructions';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl">
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    Anxius | AI Customer Service Chat Demo
                  </h1>
                  <p className="text-lg text-gray-600 mb-4">
                    Click the chat button in the bottom right corner to start a conversation.
                  </p>
                  <Link 
                    to="/setup"
                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <span>View setup instructions</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <ChatButton />
              <ChatWindow />
            </div>
          }
        />
        <Route path="/setup" element={<SetupInstructions />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;