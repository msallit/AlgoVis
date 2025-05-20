
After Setup (check the setup guild file) you can run the project as follow: 
Note: open one terminal for backend and one terminal for frontend

BACKEND (Python + FastAPI)
--------------------------
1. Navigate to the backend directory:
   cd backend

2. Create a virtual environment (optional but recommended):
   python -m venv venv
   source venv/bin/activate   # On Windows use: venv\Scripts\activate

3. Install dependencies:
   pip install -r requirements.txt

4. Run the FastAPI server:
   uvicorn main:app --reload

   The server will start on http://localhost:8000

FRONTEND (React.js)
-------------------
1. Navigate to the frontend directory:
   cd frontend

2. Install dependencies:
   npm install

3. Start the React development server:
   npm start

   The frontend will run on http://localhost:3000

NOTES:
------
- Ensure the backend is running before using the sort functionality on the frontend.
- Use only numbers in the input field to avoid validation errors (e.g., "3,1,4,2").
- Sorting steps and explanations will be visualized once the sort is triggered.



PROJECT DOCUMENTATION: AlgoVis
=================================

AlgoVis is a full-stack educational web application that visualizes how different sorting algorithms work.
It includes both a frontend built with React.js and a backend built with FastAPI in Python.

--------------------------------------------------------------------------------
TECHNOLOGIES USED
--------------------------------------------------------------------------------
Frontend:
- React.js (UI rendering)
- Axios (HTTP requests to backend)
- HTML/CSS (basic layout)
- JavaScript / JSX (components and logic)

Backend:
- Python3
- FastAPI (API creation)
- Uvicorn (ASGI server)
- unittest (for backend testing)

Development Tools:
- Node.js & npm (for frontend dependencies)
- pip / requirements.txt (for backend dependencies)
- Git (for version control)

--------------------------------------------------------------------------------
🔁 HOW IT WORKS
--------------------------------------------------------------------------------

1. The user enters a comma-separated list of numbers on the frontend (e.g., "3,1,2").
2. The user selects a sorting algorithm (Bubble Sort, Merge Sort, etc.).
3. The frontend sends this data to the backend using an HTTP POST request to `/sort`.
4. The backend validates the input, runs the selected sorting algorithm, and records all steps.
5. Each algorithm returns:
   - A list of step-by-step actions (compare, swap, insert, done)
   - The fully sorted array
   - Performance metrics (time, number of comparisons and swaps)
6. The frontend visualizes each step and displays the explanation of what is happening.
7. Users see animated bars moving to represent the sort process, along with descriptions.



FILE: App.jsx
----------------------------------------

Function/Component: App()
Description: Main application component that handles input, API requests, and renders visual output.

Function/Component: 
Description: Handles UI logic or interactivity on the frontend.

Function/Component: 
Description: Handles UI logic or interactivity on the frontend.


FILE: index.js
----------------------------------------


FILE: VisualBars.jsx
----------------------------------------

Function/Component: VisualBars
Description: Visual component that animates the sorting steps using bars.


FILE: TTS.jsx
----------------------------------------

Function/Component: TTS
Description: Text-to-Speech component for accessibility and audio feedback.


FILE: Challenge.jsx
----------------------------------------

Function/Component: Challenge
Description: Optional logic for generating algorithm challenges or quizzes.

Function/Component: 
Description: Handles UI logic or interactivity on the frontend.


FILE: main.py
----------------------------------------

Class: SortRequest
Description: Encapsulates logic or structure used in the backend system.
Function: sort_array
Description: Performs a sorting algorithm while recording each step for visualization.


FILE: sorting.py
----------------------------------------
Function: bubble_sort
Description: Performs a sorting algorithm while recording each step for visualization.
Function: merge_sort
Description: Performs a sorting algorithm while recording each step for visualization.
Function: merge
Description: Merges two sorted arrays during merge sort.
Function: divide
Description: Recursively divides the array for merge sort.


FILE: base.py
----------------------------------------

Class: SortingAlgorithm
Description: Encapsulates logic or structure used in the backend system.
Function: sort
Description: Performs a sorting algorithm while recording each step for visualization.


FILE: bubble_sort.py
----------------------------------------

Class: BubbleSort
Description: Encapsulates logic or structure used in the backend system.
Function: sort
Description: Performs a sorting algorithm while recording each step for visualization.


FILE: merge_sort.py
----------------------------------------

Class: MergeSort
Description: Encapsulates logic or structure used in the backend system.
Function: sort
Description: Performs a sorting algorithm while recording each step for visualization.
Function: merge
Description: Merges two sorted arrays during merge sort.
Function: divide
Description: Recursively divides the array for merge sort.


FILE: sort_manager.py
----------------------------------------

Class: SortManager:
Description: Encapsulates logic or structure used in the backend system.
Function: __init__
Description: Initializes the class instance.
Function: sort
Description: Performs a sorting algorithm while recording each step for visualization.


FILE: insertion_sort.py
----------------------------------------

Class: InsertionSort
Description: Encapsulates logic or structure used in the backend system.
Function: sort
Description: Performs a sorting algorithm while recording each step for visualization.


FILE: quick_sort.py
----------------------------------------

Class: QuickSort
Description: Encapsulates logic or structure used in the backend system.
Function: sort
Description: Performs a sorting algorithm while recording each step for visualization.
Function: quicksort
Description: Performs a sorting algorithm while recording each step for visualization.
Function: partition
Description: Partitions the array around a pivot for quicksort.


FILE: test_sorting.py
----------------------------------------

Class: TestSortingAlgorithms
Description: Encapsulates logic or structure used in the backend system.
Function: setUp
Description: Performs a specific task as part of the sorting logic.
Function: test_bubble_sort
Description: Performs a sorting algorithm while recording each step for visualization.
Function: test_insertion_sort
Description: Performs a sorting algorithm while recording each step for visualization.
Function: test_merge_sort
Description: Performs a sorting algorithm while recording each step for visualization.
Function: test_quick_sort
Description: Performs a sorting algorithm while recording each step for visualization.
Function: test_empty_array
Description: Performs a specific task as part of the sorting logic.
Function: test_single_element
Description: Performs a specific task as part of the sorting logic.
Function: test_duplicates
Description: Performs a specific task as part of the sorting logic.
Function: test_already_sorted
Description: Performs a sorting algorithm while recording each step for visualization.
Function: test_reverse_sorted
Description: Performs a sorting algorithm while recording each step for visualization.
Function: test_mixed_signs
Description: Performs a specific task as part of the sorting logic.
Function: test_invalid_algorithm
Description: Performs a specific task as part of the sorting logic.
Function: test_invalid_input_type
Description: Performs a specific task as part of the sorting logic.

