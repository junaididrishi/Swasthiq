import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HandoffQueue from './HandoffQueue';
import Conversation from './Conversation';

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
        <aside className="w-16 bg-white border-r flex flex-col items-center py-4 space-y-6">
          <Link className="text-blue-600 font-bold bg-blue-50 p-2 rounded" to="/">SQ</Link>
        </aside>
        
        <main className="flex-1 p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HandoffQueue />} />
            <Route path="/conversation/:id" element={<Conversation />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}