import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import './AIComp.css';

const AIComp = () => {
  const [preferences, setPreferences] = useState("");
  const [destination, setDestination] = useState("");

  const handlePreferencesChange = (e) => {
    setPreferences(e.target.value);
  };

  const generateDestination = async () => {
    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const prompt = `Discover your perfect travel destination tailored to your preferences: ${preferences}. Immerse yourself in breathtaking scenic landscapes, rich cultural experiences, and thrilling adventure opportunities. Additionally, share insights about the local community and their way of life.Please refrain from using bold text to highlight the responses.`;
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().replace(/\*\*/g, '').replace(/\*/g, '');

      const destinationPoints = text.split(/\d+\.\s+/).filter(Boolean);

      const formattedResponse = destinationPoints.map((point, index) => (
        <div key={index} className="destinationPoint">
          <strong>{index + 1}. </strong>
          {point.split('\n').map((line, i) => (
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
    }
  };

  return (
    <div className="container">
      <h1 className="heading">Destination Generator</h1>
      <div className="inputContainer">
        <label className="label">
          Likes:
          <input
            type="text"
            value={preferences}
            onChange={handlePreferencesChange}
            className="input"
          />
        </label>
      </div>
      <button className="button" onClick={generateDestination}>
        Generate Destination
      </button>
      {destination && (
        <div className="resultContainer">
          <h2 className="resultHeading">Recommended Destination:</h2>
          <div>{destination}</div>
        </div>
      )}
    </div>
  );
};

export default AIComp;
