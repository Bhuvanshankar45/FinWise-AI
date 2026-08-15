from tests.conftest import client


def login_user():
    register_response = client.post('/api/v1/auth/register', json={
        'name': 'Transaction User',
        'email': 'transaction@example.com',
        'password': 'secure123'
    })

    if register_response.status_code == 201:
        login_response = client.post('/api/v1/auth/login', json={
            'email': 'transaction@example.com',
            'password': 'secure123'
        })
    else:
        login_response = client.post('/api/v1/auth/login', json={
            'email': 'transaction@example.com',
            'password': 'secure123'
        })

    assert login_response.status_code == 200, login_response.text
    return login_response.json()['access_token']


def test_create_and_read_transaction():
    token = login_user()
    create = client.post('/api/v1/transactions', json={
        'type': 'expense',
        'amount': 2500,
        'category': 'Food',
        'description': 'Team lunch',
        'transaction_date': '2026-08-15'
    }, headers={'Authorization': f'Bearer {token}'})
    assert create.status_code == 201

    list_response = client.get('/api/v1/transactions', headers={'Authorization': f'Bearer {token}'})
    assert list_response.status_code == 200
    assert len(list_response.json()) >= 1
