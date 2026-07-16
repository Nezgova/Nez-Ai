import { useState } from "react";
import "./App.css";
import { testBackend } from "./services/api";

function App() {
  const [response, setResponse] = useState("Waiting...");

  async function handleTest() {
    try {
      const result = await testBackend();
      setResponse(result);
    } catch (error) {
  console.error(error);
  setResponse(String(error));
}
  }

  return (
    <div className="container">
      <h1>🤖 Nez AI</h1>

      <p>Local AI Assistant</p>

      <button onClick={handleTest}>
        Test Backend
      </button>

      <h2>Response</h2>

      <p>{response}</p>
    </div>
  );
}

export default App;