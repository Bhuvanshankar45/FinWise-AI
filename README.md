<div align="center">

# 🏋️ FitAI — Intelligent Fitness & Nutrition Coach

**A premium AI-powered fitness & nutrition web application built with Streamlit, Machine Learning, and a polished glassmorphism UI.**

![Python](https://img.shields.io/badge/Python-3.12+-blue.svg)
![Streamlit](https://img.shields.io/badge/Streamlit-1.32+-red.svg)
![ML](https://img.shields.io/badge/ML-Scikit--Learn-orange.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

</div>

---

## ✨ Features

### 🔐 Authentication
- Secure Signup, Login, Logout, Forgot Password (token-based)
- Password hashing (bcrypt) and session management
- Input validation & SQL injection prevention

### 📊 Dashboard
- Personal metrics: BMI, BMR, TDEE, Daily Calories
- Protein, water, sleep goals
- Weekly/monthly progress charts
- Achievement badges

### 🧮 Calculators
- **BMI Calculator** with categories & suggestions
- **BMR Calculator** (Mifflin-St Jeor)
- **TDEE Calculator** (5 activity levels)
- **Protein, Water & Macro Calculators**

### 🤖 Machine Learning
- **Daily Calorie Predictor** — Multiple Linear Regression
- **Weight Prediction** — Linear Regression (30/60/90/180 days)
- **Workout Recommender** — Random Forest
- **Fitness Classifier** — Decision Tree
- **User Segmentation** — K-Means Clustering

### 🍽️ Nutrition
- Personalized **Meal Planner** (8 diet types)
- **Food Nutrition Search** (calories, macros, vitamins)
- Interactive macro charts

### 🏋️ Workouts
- **Workout Recommendation** (home/gym, by goal & experience)
- **Exercise Library** with muscle groups & details
- **Calorie Burn Calculator** (8 activities)

### 🧠 AI Fitness Coach
- Gemini / OpenAI / Local rule-based fallback
- Conversational fitness & nutrition advice

### 📈 Analytics & Reports
- Weekly analytics & insights
- Achievement badges
- **Downloadable PDF reports**

---

## 🚀 Quick Start

### 1. Prerequisites
- Python 3.12+
- (Optional) Gemini API key or OpenAI API key

### 2. Clone & Setup
```bash
cd FitAI
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Generate Datasets & Train Models
```bash
python -m datasets.generate_data
python -m models.train_all
```

### 4. Run the App
```bash
streamlit run app.py
```

---

## 🧪 Testing

Compile-check all Python files:
```bash
python -m py_compile $(find . -name "*.py")
```
Or on Windows PowerShell:
```powershell
python -c "import py_compile, pathlib; [py_compile.compile(str(p), doraise=True) for p in pathlib.Path('.').rglob('*.py')]"
```

---

## 🗂️ Project Structure

```
FitAI/
├── app.py                  # Main entry point
├── config.py               # Central configuration
├── database.py             # SQLite data layer
├── authentication.py       # Auth & security
├── ai_coach.py             # AI chat integration
├── requirements.txt
├── README.md
├── datasets/               # Dataset generation & CSV files
├── models/                 # ML model training & inference
├── saved_models/           # Trained models & metrics
├── components/             # Reusable UI components
├── pages/                  # Feature pages
├── utils/                  # Helpers & services
├── assets/                 # Static assets
├── images/                 # Images
├── reports/                # Generated PDF reports
└── logs/                   # Application logs
```

---

## 🔐 Security

- **Password hashing** via bcrypt
- **SQL injection prevention** via parameterized queries
- **Input validation** on all user inputs
- **Session management** with Streamlit session_state
- **Error handling** & logging throughout

---

## 🤖 AI Integration

Set environment variables in `.env`:
```
GEMINI_API_KEY=your_gemini_key
OPENAI_API_KEY=your_openai_key
```

The app tries **Gemini** → **OpenAI** → **Local rule-based fallback** automatically.

---

## ☁️ Deployment

### Streamlit Community Cloud
1. Push the repo to GitHub
2. Create a new app at [share.streamlit.io](https://share.streamlit.io)
3. Select the repo & `app.py`

### Render
- Create a new **Web Service**
- Build command: `pip install -r requirements.txt`
- Start command: `streamlit run app.py --server.port $PORT`

### Railway
- Add `requirements.txt`
- Start command: `streamlit run app.py --server.port 8501`

---

## 📄 Documentation

- [Model Documentation](docs/MODELS.md)
- [Dataset Documentation](docs/DATASETS.md)
- [User Manual](docs/USER_MANUAL.md)

---

## ⚠️ Disclaimer

FitAI provides informational fitness & nutrition guidance only and is **not** a substitute for professional medical, nutritional, or fitness advice. Always consult a qualified professional before starting any new program.

---

## 📝 License

MIT
</content>
