import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";
import months from "@/utils/months";

const AIComp = () => {
  const [preferences, setPreferences] = useState("");
  const [budget, setBudget] = useState("");
  const [month, setMonth] = useState("");
  const [numTravelers, setNumTravelers] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = "Destination Generator";
  }, []);

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

      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Discover your perfect travel destination tailored to your preferences: ${preferences}. Plan your trip with a budget of ${budget} in US Dollars, in the month of ${month}, and for ${numTravelers} travelers. Immerse yourself in breathtaking scenic landscapes, rich cultural experiences, and thrilling adventure opportunities. Additionally, share insights about the local community and their way of life. Please refrain from using bold text to highlight the responses.`;

      const result = await model.generateContent(prompt);
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
        console.error("Response data:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-20">
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
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
        <div>
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
        <div>
          <label className="block text-gray-700 py-1">Month of Travel:</label>
          <select
            value={month}
            onChange={handleMonthChange}
            // className=" px-3 py-1 mt-1"
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
          <h2 className="text-2xl font-bold text-black-400 p-4">
            Recommended Destination:
          </h2>
          <div className="summary_box">
            {destination}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIComp;
