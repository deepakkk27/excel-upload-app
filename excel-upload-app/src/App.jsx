import React, { useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import "./App.css"; // Import the CSS file for styling

const App = () => {
  const [data, setData] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null); // Reference to reset file input

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const resultData = response.data;
      setData(resultData);

      // Prepare data for the chart
      const labels = resultData.map((row, index) => `Row ${index + 1}`);
      const values = resultData.map((row) => row.value || 0);

      setChartData({
        labels,
        datasets: [
          {
            label: "Processed Data",
            data: values,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      });
    } catch (err) {
      setError("Failed to upload file. Please try again.");
    }

    setLoading(false);
  };

  const handleReset = () => {
    setData([]);
    setChartData(null);
    setError("");
    setLoading(false);

    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="container">
      <div className="upload-box">
        <h2>Upload Excel File</h2>
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} ref={fileInputRef} />
        <button onClick={handleReset} className="reset-btn">Reset</button>
        {loading && <p>Uploading and processing...</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="content">
        <div className="results-box">
          <h3>Results</h3>
          <textarea value={JSON.stringify(data, null, 2)} readOnly></textarea>
        </div>

        <div className="chart-box">
          <h3>Graph</h3>
          {chartData ? <Bar data={chartData} /> : <p>No data to display</p>}
        </div>
      </div>
    </div>
  );
};

export default App;
