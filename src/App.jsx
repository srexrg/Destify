import AIComp from "./components/AIComp";
import "./App.css";
import Navbar from "./components/Navbar";
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
        <AIComp />
        <Analytics/>
    </div>
  );
}

export default App;
