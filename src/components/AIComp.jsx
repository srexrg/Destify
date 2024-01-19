import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import months from "@/utils/months";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const runtime = "edge";

const AIComp = () => {
  const [preferences, setPreferences] = useState("Food,Beach,Sunset");
  const [budget, setBudget] = useState("1000");
  const [month, setMonth] = useState("March");
  const [numTravelers, setNumTravelers] = useState("4");
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

      const prompt = `Discover your ideal travel destination based on your preferences. Plan your trip with a budget of $${budget} for  ${numTravelers} travelers in US Dollars, intending to travel in the month of ${month}.Your main preferences are ${preferences}.Immerse yourself in breathtaking scenic landscapes, embrace rich cultural experiences, and explore thrilling adventure opportunities.
      Additionally, gain insights into the local community and their way of life. 
      Please avoid using bold text to highlight the responses.
      only use commonmark markdown for response, use #, ##, ### for headings.
      `;

      const result = await model.generateContent(prompt);

      const response = await result.response;
      const text = response.text();

      setDestination(text);
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
            Recommended Destinations:
          </h2>
          <div className="summary_box prose sm:prose-sm lg:prose-lg xl:prose-xl 2xl:prose-2xl max-w-[1000px] text-left text-gray-700">
            <ReactMarkdown>{destination}</ReactMarkdown>
          </div>
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
