from __future__ import annotations

import math
from pathlib import Path

import joblib

from ..models import Transaction

MODEL_PATH = Path("./backend/ml/savings_model.joblib")


class SimpleLinearModel:
    def __init__(self):
        self.coefficients = []
        self.intercept = 0.0

    def _solve_linear_system(self, matrix, vector):
        n = len(matrix)
        aug = [matrix[i][:] + [vector[i]] for i in range(n)]
        for col in range(n):
            pivot = max(range(col, n), key=lambda r: abs(aug[r][col]))
            if abs(aug[pivot][col]) < 1e-9:
                continue
            aug[col], aug[pivot] = aug[pivot], aug[col]
            pivot_value = aug[col][col]
            for j in range(col, n + 1):
                aug[col][j] /= pivot_value
            for row in range(n):
                if row == col:
                    continue
                factor = aug[row][col]
                if abs(factor) < 1e-9:
                    continue
                for j in range(col, n + 1):
                    aug[row][j] -= factor * aug[col][j]
        return [aug[i][n] for i in range(n)]

    def fit(self, X, y):
        if not X:
            self.coefficients = [0.0] * 4
            self.intercept = 0.0
            return self
        features = len(X[0])
        xtx = [[0.0 for _ in range(features + 1)] for _ in range(features + 1)]
        xty = [0.0 for _ in range(features + 1)]

        for row, target in zip(X, y):
            extended = row + [1.0]
            for i in range(features + 1):
                xty[i] += extended[i] * target
                for j in range(features + 1):
                    xtx[i][j] += extended[i] * extended[j]

        beta = self._solve_linear_system(xtx, xty)
        self.coefficients = beta[:features]
        self.intercept = beta[features] if len(beta) > features else 0.0
        return self

    def predict(self, X):
        predictions = []
        for row in X:
            total = self.intercept
            for coef, value in zip(self.coefficients, row):
                total += coef * value
            predictions.append(total)
        return predictions


class BaselineAverageModel:
    def __init__(self):
        self.average = 0.0

    def fit(self, X, y):
        if not y:
            self.average = 0.0
            return self
        self.average = sum(y) / len(y)
        return self

    def predict(self, X):
        return [self.average for _ in X]


def _fallback_dataset():
    return [
        [18000, 9600, 24000, 8400, 8200],
        [20000, 10500, 31000, 9500, 9600],
        [22000, 11800, 38000, 10200, 10500],
        [24000, 12600, 46000, 11400, 11700],
        [25000, 13000, 53000, 12000, 12100],
        [27000, 13800, 61000, 13200, 12950],
    ]


def build_dataset_from_transactions(db, user_id):
    rows = db.query(Transaction).filter(Transaction.user_id == user_id).order_by(Transaction.transaction_date.asc()).all()
    if not rows:
        return _fallback_dataset()

    records = []
    for row in rows:
        income = float(row.amount) if row.type == "income" else 0.0
        expense = float(row.amount) if row.type == "expense" else 0.0
        savings = income - expense
        records.append([income, expense, savings, savings, savings])
    if not records:
        return _fallback_dataset()
    return records


def _mae(actual, predicted):
    return sum(abs(a - p) for a, p in zip(actual, predicted)) / max(len(actual), 1)


def _rmse(actual, predicted):
    return math.sqrt(sum((a - p) ** 2 for a, p in zip(actual, predicted)) / max(len(actual), 1))


def _r2(actual, predicted):
    avg = sum(actual) / max(len(actual), 1)
    numerator = sum((a - p) ** 2 for a, p in zip(actual, predicted))
    denominator = sum((a - avg) ** 2 for a in actual)
    if denominator == 0:
        return 1.0
    return 1 - (numerator / denominator)


def compare_models(data):
    if not data or len(data) < 2:
        data = _fallback_dataset()

    X = [row[:4] for row in data]
    y = [row[4] for row in data]
    split_index = max(1, len(X) - 1)
    train_X = X[:split_index]
    train_y = y[:split_index]
    test_X = X[split_index:]
    test_y = y[split_index:]

    models = {
        "LinearRegression": SimpleLinearModel(),
        "BaselineAverage": BaselineAverageModel(),
    }
    results = {}
    for name, model in models.items():
        model.fit(train_X, train_y)
        predictions = model.predict(test_X)
        results[name] = {
            "mae": round(_mae(test_y, predictions), 4),
            "rmse": round(_rmse(test_y, predictions), 4),
            "r2": round(_r2(test_y, predictions), 4),
        }

    best_model_name = min(results, key=lambda name: (results[name]["mae"], results[name]["rmse"]))
    return {"metrics": results, "best_model": best_model_name, "train_size": len(train_X), "test_size": len(test_X)}


def train_and_serialize_model(db, user_id: str | int):
    data = build_dataset_from_transactions(db, user_id)
    comparison = compare_models(data)
    chosen_model_name = comparison["best_model"]
    model = SimpleLinearModel() if chosen_model_name == "LinearRegression" else BaselineAverageModel()
    X = [row[:4] for row in data]
    y = [row[4] for row in data]
    model.fit(X, y)
    path = Path(MODEL_PATH)
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = {"model": model, "feature_names": ["monthly_income", "monthly_expenses", "current_savings", "monthly_savings"], "training_summary": comparison}
    joblib.dump(payload, path)
    return {"model_name": chosen_model_name, "comparison": comparison}


def load_model():
    path = Path(MODEL_PATH)
    if not path.exists():
        return {"model": SimpleLinearModel(), "feature_names": ["monthly_income", "monthly_expenses", "current_savings", "monthly_savings"]}
    return joblib.load(path)


def predict_next_months(user_input: dict):
    payload = load_model()
    model = payload.get("model", SimpleLinearModel())
    features = [
        user_input.get("monthly_income", 0),
        user_input.get("monthly_expenses", 0),
        user_input.get("current_savings", 0),
        user_input.get("monthly_savings", 0),
    ]
    base = model.predict([features])[0]
    return {
        "3_month": round(max(base * 1.05, 0), 2),
        "6_month": round(max(base * 1.12, 0), 2),
        "12_month": round(max(base * 1.28, 0), 2),
    }
