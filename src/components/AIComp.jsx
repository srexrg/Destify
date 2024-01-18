import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import months from "@/utils/months";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const runtime = "edge"
const AIComp = () => {
  const [preferences, setPreferences] = useState("");
  const [budget, setBudget] = useState("");
  const [month, setMonth] = useState("");
  const [numTravelers, setNumTravelers] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePreferencesChange = (e) => {
    setPreferences(e.target.value);
  };

  const handleBudgetChange = (e) => {
    setBudget(e.target.value);
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleNumTravelersChange = (e) => {
    setNumTravelers(e.target.value);
  };

  const generateDestination = async () => {
    try {
      setLoading(true);
  
      if (!preferences || !budget || !month || !numTravelers) {
        toast.error("Please fill all the Input Fields");
        return;
      }
  
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
      const prompt = `Discover your ideal travel destination based on your preferences. Plan your trip with a budget of $${budget} for  ${numTravelers} travelers in US Dollars, intending to travel in the month of ${month}.Immerse yourself in breathtaking scenic landscapes, embrace rich cultural experiences, and explore thrilling adventure opportunities. Additionally, gain insights into the local community and their way of life. Please avoid using bold text to highlight the responses.`;
  
      const result = await model.generateContent(prompt, {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 1000,
      });
  
      const response = result.response;
      const text = response.text().replace(/\*\*/g, "").replace(/\*/g, "");
  
      const destinationPoints = text.split(/\d+\.\s+/).filter(Boolean);
  
      const formattedResponse = destinationPoints.map((point, index) => (
        <div key={index} className="destinationPoint">
          <strong>{index + 1}. </strong>
          {point.split("\n").map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </div>
      ));
  
      setDestination(formattedResponse);
    } catch (error) {
      console.error("Error generating destination:", error);
      if (error.response) {
        toast.error("Naughty ho rahe kyaa");
        console.log(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="mx-auto p-6 lg:p-20">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
    <div className="mb-4 sm:mb-0">
      <label className="block text-gray-700 py-2">
        Preferences:
        <Input
          type="text"
          value={preferences}
          onChange={handlePreferencesChange}
          className="url_input"
        />
      </label>
    </div>
    <div className="mb-4 sm:mb-0">
      <label className="block text-gray-700 py-2">
        Budget:
        <Input
          type="text"
          value={budget}
          onChange={handleBudgetChange}
          className="url_input"
        />
      </label>
    </div>
    <div className="mb-4 sm:mb-0">
      <label className="block text-gray-700 py-1">Month of Travel:</label>
      <select
        value={month}
        onChange={handleMonthChange}
        className="url_input px-3 py-1"
      >
        <option value="">Select Month</option>
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-gray-700 py-2">
        Number of Travelers:
        <Input
          type="text"
          value={numTravelers}
          onChange={handleNumTravelersChange}
          className="url_input"
        />
      </label>
    </div>
  </div>
  <Button
    className="cursor-pointer mt-4"
    onClick={generateDestination}
    disabled={loading}
  >
    {loading ? "Generating..." : "Generate Destination"}
  </Button>
  {destination && (
    <div className="mt-8">
      <h2 className="mt-5 text-4xl font-extrabold p-4 leading-[1.15] text-black sm:text-3xl text-center">
        Recommended Destination:
      </h2>
      <div className="summary_box">{destination}</div>
    </div>
  )}
  <ToastContainer
    position="top-right"
    autoClose={5000}
    hideProgressBar={false}
    closeOnClick
    draggable
    pauseOnHover
  />
</div>

  );
};

export default AIComp;
