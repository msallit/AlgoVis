import React, { useState, useEffect } from 'react';
import axios from 'axios';
import VisualBars from './components/VisualBars';
import TTS from './components/TTS';
import Challenge from './components/Challenge';

// This is the main function/component: App
function App() {
  const [array, setArray] = useState('');
  const [algorithm, setAlgorithm] = useState('bubble');
  const [steps, setSteps] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentArray, setCurrentArray] = useState([]);
  const [highlight, setHighlight] = useState([]);
  const [explanation, setExplanation] = useState('');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [challengeMode, setChallengeMode] = useState(true);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [stepHistory, setStepHistory] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [isLoadingAI, setIsLoadingAI] = useState(false);



 // Sends the user’s array to the backend at /ai-suggest.
// Displays the returned AI-generated suggestion as it streams in real-time
const handleAISuggestion = async () => {
  // Clear previous data before making new AI request
  setSteps([]);
  setMetrics({});
  setCurrentArray([]);
  setCurrentStep(0);
  setExplanation('');
  setIsLoadingAI(true);
  setAiSuggestion(''); // Reset AI suggestion display

  try {
    // Convert input string to an array of numbers
    const parsedArray = array.split(',').map(Number);

    // Determine backend API URL based on environment
    const API_BASE =
      process.env.NODE_ENV === "development"
        ? "http://localhost:8000"
        : process.env.REACT_APP_API_BASE;

    // 📡 Send POST request to backend to get AI-generated suggestion
    const response = await fetch(`${API_BASE}/ai-suggest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ array: parsedArray }),
    });

    //  Handle failed fetch
    if (!response.ok) throw new Error("Failed to fetch AI suggestion");

    //  Stream the response back as it's being received
    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      result += chunk;
      setAiSuggestion(prev => prev + chunk); //  Update live as it streams
    }

  } catch (err) {
    console.error("AI fetch error:", err);
    setAiSuggestion("Error fetching suggestion.");
  } finally {
    setIsLoadingAI(false); // Stop loading spinner
  }
};



// This component/function handles: handleSort
  const handleSort = async () => {
    setAiSuggestion(""); // Clear previous AI suggestion
    const parsedArray = array.split(',').map(Number);
    const response = await axios.post(
  `https://algovis-1.onrender.com/sort/${algorithm}`,
  { array: parsedArray }
);



    setSteps(response.data.steps);
    setMetrics(response.data.metrics);
    setCurrentArray(parsedArray);
    setCurrentStep(0);
    setExplanation('');
    setFeedback('');
    setHighlight([]);
    setStepHistory([]);
  };

  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length && !challengeMode) {
// This component/function handles: timer
      const timer = setTimeout(() => {
        const step = steps[currentStep];
        applyStep(step);
        setStepHistory(prev => [...prev, step]);
        setCurrentStep(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [steps, currentStep, challengeMode]);

// This component/function handles: applyStep
  const applyStep = (step) => {
    setExplanation(step.explanation || '');
    if (step.type === 'swap' && step.array) {
      setCurrentArray(step.array);
      setHighlight(step.indices);
    } else if (step.type === 'compare') {
      setHighlight(step.indices || []);
    } else {
      setHighlight([]);
    }
  };

// This component/function handles: formatStep
  const formatStep = (step) => {
    const [a, b] = step.indices || step.values || [];
    const av = currentArray[a] ?? a;
    const bv = currentArray[b] ?? b;
    if (step.type === 'compare') {
      return `Compare index ${a} (${av}) with index ${b} (${bv})`;
    } else if (step.type === 'swap') {
      return `Swap index ${a} (${av}) with index ${b} (${bv})`;
    } else if (step.type === 'insert') {
      return `Insert value ${av} at index ${a}`;
    } else {
      return `${step.type}`;
    }
  };

// This component/function handles: handleGuess
  const handleGuess = (guess) => {
    const expected = steps[currentStep];
    const guessClean = guess.replace(/\s/g, '').toLowerCase();
    const expectedStr = `${expected.type}[${(expected.indices || expected.values || []).join(',')}]`;
    if (guessClean === expectedStr) {
      setFeedback('✅ Correct!');
      applyStep(expected);
      setStepHistory(prev => [...prev, expected]);
      setCurrentStep(prev => prev + 1);
    } else {
      setFeedback(`❌ Incorrect. Expected something like: ${expectedStr}`);
    }
  };

  return (
    <div style={{ fontFamily: 'Arial', margin: '2rem' }}>
      <h1 style={{ fontSize: '2rem' }}>AlgoVis - Sorting Visualizer</h1>
      <input
        style={{ padding: '0.5rem', width: '300px' }}
        type="text"
        value={array}
        onChange={e => setArray(e.target.value)}
        placeholder="Enter comma-separated numbers"
      />
      <select
        style={{ padding: '0.5rem', marginLeft: '1rem' }}
        value={algorithm}
        onChange={e => setAlgorithm(e.target.value)}
      >
        <option value="bubble">Bubble Sort</option>
        <option value="merge">Merge Sort</option>
        <option value="insertion">Insertion Sort</option>
        <option value="quick">Quick Sort</option>
      </select>
      <label style={{ marginLeft: '1rem' }}>
        <input
          type="checkbox"
          checked={challengeMode}
          onChange={() => setChallengeMode(!challengeMode)}
        />
        Challenge Mode
      </label>
      <label style={{ marginLeft: '1rem' }}>
        <input
          type="checkbox"
          checked={ttsEnabled}
          onChange={() => setTtsEnabled(!ttsEnabled)}
        />
        Narrative Mode
      </label>
        <button style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }} onClick={handleAISuggestion} disabled={isLoadingAI}>
          {isLoadingAI ? 'Optimizing...' : 'Suggest Best Sorting Algorith (AI)'}
        </button>     
       <button style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }} onClick={handleSort}>
        Sort
      </button>
      {aiSuggestion && (
  <div style={{ marginTop: "1rem", padding: "1rem", background: "#f5f5f5", borderRadius: "5px" }}>
    <h3>AI Suggestion:</h3>
    <p style={{ margin: "0.5rem 0", whiteSpace: "pre-wrap" }}>{aiSuggestion}</p>
  </div>
)}

      {metrics && (
        <div style={{ marginTop: '1rem' }}>
          {metrics?.comparisons !== undefined && <p><strong>Comparisons:</strong> {metrics.comparisons}</p>}
          {metrics?.swaps !== undefined && <p><strong>Swaps:</strong> {metrics.swaps}</p>}
          {metrics?.time !== undefined && <p><strong>Time</strong>: {metrics.time.toFixed(2)} ms</p>}
        </div>
      )}

      <VisualBars array={currentArray} highlight={highlight} />

      {ttsEnabled && explanation && (
        <div style={{ marginTop: '1rem', fontStyle: 'italic' }}>
          {explanation}
          <TTS text={explanation} />
        </div>
      )}

      {!ttsEnabled && stepHistory.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Steps:</h3>
          <ul>
            {stepHistory.map((s, i) => (
              <li key={i}>{formatStep(s)}</li>
            ))}
          </ul>
        </div>
      )}

      {challengeMode && steps.length > 0 && currentStep < steps.length && (
        <Challenge currentStep={steps[currentStep]} onGuess={handleGuess} />
      )}

      {feedback && (
        <div style={{ marginTop: '1rem', fontWeight: 'bold', color: feedback.startsWith('✅') ? 'green' : 'red' }}>
          {feedback}
        </div>
      )}
    </div>
  );
}

export default App;