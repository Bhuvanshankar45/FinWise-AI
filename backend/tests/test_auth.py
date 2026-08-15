from tests.conftest import client


def test_register_and_login():
    response = client.post('/api/v1/auth/register', json={
        'name': 'Test User',
        'email': 'auth@example.com',
        'password': 'secure123'
    })
    assert response.status_code == 201

    login = client.post('/api/v1/auth/login', json={
        'email': 'auth@example.com',
        'password': 'secure123'
    })
    assert login.status_code == 200
    assert login.json()['access_token']
