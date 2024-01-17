import AIComp from "./components/pages/AIComp";
import "./App.css";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
        <AIComp />
    </div>
  );
}

export default App;
