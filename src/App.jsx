import AIComp from "./components/AIComp";
import "./App.css";
import Hero from "./components/Navbar";
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero/>
        <AIComp />
        <Analytics/>
    </div>
  );
}

export default App;
