# Basket

Express API for basket management. Runs on port 3001.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | /v2/basket | Create a basket |
| GET | /v2/basket?userId= | Get latest basket for a user |

## Run

```bash
npx nx serve basket
```

## POST /v2/basket

```json
{ "userId": "user1", "items": [{ "productId": "p1", "quantity": 2 }] }
```
