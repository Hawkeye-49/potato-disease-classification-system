# Potato Disease Classification System

A deep learning-based web application for classifying potato plant diseases using TensorFlow and a React frontend. Upload a photo of a potato plant and get an instant prediction with confidence score.

**Detectable Classes:**
- Black Scurf
- Blackleg
- Common Scab
- Dry Rot
- Healthy Potatoes
- Miscellaneous
- Pink Rot

---

## Requirements

| Tool | Version |
|------|---------|
| Python | 3.10.x |
| Node.js | 16.x |
| npm | 8.x (bundled with Node.js 16) |

---

## Project Structure

```
potato-disease-classification-system-main/
├── api/
│   └── main.py                   # FastAPI backend
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env                      # API URL config
│   ├── package-lock.json
│   └── package.json              # React dependencies
├── saved_models/
│   ├── final/                    # Final trained model
│   └── phase1/                   # Phase 1 model checkpoint
├── training/
│   ├── dataset/                  # Training images per class
│   ├── testing_data/             # Testing images for Standalone prediction
│   ├── confusion_matrix.png      # Model evaluation result
│   ├── requirements.txt          # Python training dependencies
│   ├── training.ipynb            # Training notebook
│   └── training_history.png      # Loss & accuracy plot
├── .gitignore
├── README.md
└── potato_disease.py             # Standalone prediction script
```

---

## Setup & Installation

### 1. Clone / Extract Project

```bash
# If from zip, extract then enter the folder
cd potato-disease-classification-system-main
```

---

### 2. Backend Setup (Python 3.10 + Virtual Environment)

#### Verify Python version

```bash
python --version
# Expected: Python 3.10.x
```

> If you have multiple Python versions installed, use `python3.10` instead of `python`.

#### Create virtual environment

```bash
# Create venv using Python 3.10
python -m venv venv

# Or explicitly point to Python 3.10 if multiple versions exist:
python -3.10 -m venv .venv
```

#### Activate virtual environment

```bash
# Windows (Command Prompt)
.venv\Scripts\activate

# Windows (PowerShell)
.venv\Scripts\Activate.ps1

# macOS / Linux
source .venv/bin/activate
```

> After activation, your terminal prompt will show `(venv)` at the beginning.

#### Install Python dependencies

```bash
cd training
pip install -r requirements.txt
```

#### Run the backend server

```bash
python api/main.py
```

The API will be running at **http://localhost:8000**

To verify, open http://localhost:8000/ping in your browser. You should see:
```
"Hello, I am alive"
```

#### Deactivate virtual environment (when done)

```bash
deactivate
```

---

### 3. Frontend Setup (Node.js 16)

#### Verify Node.js version

```bash
node --version
# Expected: v16.x.x

npm --version
# Expected: 8.x.x
```

#### Navigate to frontend folder

```bash
cd frontend
```

#### Install dependencies

```bash
npm install
```

#### Start the frontend

```bash
npm start
```

The app will open automatically at **http://localhost:3000**

---

## Running the Full App

You need **two terminals running simultaneously**:

| Terminal | Command | URL |
|----------|---------|-----|
| Terminal 1 (Backend) | `python api/main.py` | http://localhost:8000 |
| Terminal 2 (Frontend) | `npm start` (inside `/frontend`) | http://localhost:3000 |

Make sure the backend is running before using the frontend — the React app sends prediction requests to `http://localhost:8000/predict`.

---

## Standalone Prediction (Without Frontend)

You can test predictions directly via the command line without starting the frontend:

```bash
# Make sure venv is active and you're in the project root
python potato_disease.py
```

To test with your own image, edit the last line in `potato_disease.py`:

```python
# Change this path to your image
result = predict_image('path/to/your/image.jpg')
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ping` | Health check |
| POST | `/predict` | Upload an image and get a prediction |

**Example `/predict` response:**
```json
{
  "class": "Black Scurf",
  "confidence": 0.9731
}
```
