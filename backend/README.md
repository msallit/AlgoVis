# AlgoVis Backend + Frontend Documentation

## 🧠 Structure

### Backend
- `main.py`: FastAPI entry point
- `algorithms/`
  - `base.py`: Abstract sorting algorithm class
  - `bubble_sort.py`, `merge_sort.py`: Sorting implementations
  - `sort_manager.py`: Maps algorithm names to implementations
- `tests/`: Unit tests
- `requirements.txt`: Backend dependencies

### Frontend
- `src/`
  - `App.jsx`: Main React logic
  - `index.js`: Entry point
  - `components/`
    - `VisualBars.jsx`: Animated sorting bars
    - `TTS.jsx`: Text-to-speech for explanations
    - `Challenge.jsx`: Interactive guessing challenge
- `public/index.html`: Required React root HTML
- `package.json`: Scripts and dependencies

---

## ✅ Features

### ✅ Sorting Visualizer
- Select an algorithm (Bubble, Merge)
- Watch step-by-step comparisons and swaps
- Visual bars update dynamically
- Listen to spoken explanations (Text-to-Speech)

### ✅ Interactive Challenge Mode
- Users guess the next step (e.g., "compare [0,1]")
- Can be toggled in App logic (coming soon)

---

## 🔌 Run Instructions

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm start
```

---

## 🧪 Sample Test Input

### Sorting
```json
{
  "array": [4, 2, 1, 3]
}
```

### Output
```json
{
  "sorted": [1, 2, 3, 4],
  "steps": [...],
  "metrics": {
    "comparisons": 6,
    "swaps": 3,
    "time": 0.001
  }
}
```

---

## 🧪 Run Unit Tests
```bash
cd backend
python -m unittest discover tests
```