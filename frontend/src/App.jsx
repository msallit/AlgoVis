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

// This component/function handles: handleSort
  const handleSort = async () => {
    const parsedArray = array.split(',').map(Number);
    const response = await axios.post(
    `${process.env.REACT_APP_API_BASE}/sort/${algorithm}`,
     { array: parsedArray });


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
        Narrative On/Off
      </label>
      <button style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }} onClick={handleSort}>
        Sort
      </button>

      {metrics && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>Comparisons:</strong> {metrics.comparisons}</p>
          <p><strong>Swaps:</strong> {metrics.swaps}</p>
          <p><strong>Time:</strong> {metrics.time.toFixed(6)}s</p>
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