import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import months from "@/utils/months";
import { ToastContainer, toast } from "react-toastify";
import { usePDF } from "react-to-pdf";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "./LoadingBar";

export const runtime = "edge";

const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "INR"]; // Add more currencies as needed

const AIComp = () => {
  const [preferences, setPreferences] = useState("Food,Beach,Sunset");
  const [budget, setBudget] = useState("");
  const [month, setMonth] = useState("");
  const [numTravelers, setNumTravelers] = useState("");
  const [currency, setCurrency] = useState("USD"); // Added state for currency
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  // const pdfRef=useRef(null)

  const { toPDF, targetRef } = usePDF({
    filename: "travel-recommendations.pdf"
  });

  const handleExportPDF = async () => {
    try {
      await toPDF();
    } catch (error) {
      toast.error("Error generating PDF");
    }
  };

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

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value); // Added handler for currency change
  };

  const generateDestination = async () => {
    try {
      setLoading(true);

      if (!preferences || !budget || !month || !numTravelers || !currency) {
        toast.error("Please fill all the Input Fields");
        setLoading(false);
        return;
      }

      const response = await fetch(
        "https://destify-backend.vercel.app/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            preferences,
            budget,
            numTravelers,
            month,
            currency,
          }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setDestination(data.data);
      } else {
        toast.error("Error generating destination");
      }
    } catch (error) {
      console.error("Error generating destination:", error);
      toast.error("Error generating destination");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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
              <div className="flex">
                <Input
                  type="text"
                  value={budget}
                  onChange={handleBudgetChange}
                  className="url_input flex-grow mr-2"
                />
                <select
                  value={currency} // Added currency selection dropdown
                  onChange={handleCurrencyChange}
                  className="url_input px-3 py-1"
                >
                  {currencies.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
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
        {loading && <LoadingBar />}
        {destination && (
          <>
            <div className="mt-8" ref={targetRef}>
              <h2 className="mt-5 text-4xl font-extrabold p-4 leading-[1.15] text-black sm:text-3xl text-center">
                Recommended Destinations:
              </h2>
              <div className="summary_box prose sm:prose-sm lg:prose-lg xl:prose-xl 2xl:prose-2xl max-w-[1000px] text-left text-gray-700">
                <ReactMarkdown>{destination}</ReactMarkdown>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <Button
                onClick={handleExportPDF}
                className="cursor-pointer mt-4"
              >
                Export as PDF
              </Button>
            </div>
          </>
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
    </>
  );
};

export default AIComp;
