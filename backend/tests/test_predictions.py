from tests.conftest import client


def test_prediction_endpoint_returns_projection():
    register_response = client.post('/api/v1/auth/register', json={
        'name': 'Prediction User',
        'email': 'prediction@example.com',
        'password': 'secure123'
    })
    login_response = client.post('/api/v1/auth/login', json={
        'email': 'prediction@example.com',
        'password': 'secure123'
    })
    assert login_response.status_code == 200, login_response.text
    token = login_response.json()['access_token']

    result = client.post('/api/v1/predictions/savings', json={
        'monthly_income': 24000,
        'monthly_expenses': 13500,
        'current_savings': 18000,
        'monthly_savings': 10500,
        'historical_savings': [12000, 13000, 10500],
        'goal_amount': 100000,
        'time_period': 12,
    }, headers={'Authorization': f'Bearer {token}'})
    assert result.status_code == 200
    data = result.json()
    assert 'prediction' in data
    assert '3_month' in data['prediction']
