# Shop

Express API for products, basket management, and order placement. Runs on port 3002.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/products | List all products |
| POST | /v1/products | Create a product |
| POST | /v1/basket | Create a basket |
| GET | /v1/basket?userId= | Get latest basket for a user |
| POST | /v1/order | Place an order from user's basket |

## Run

```bash
npx nx serve shop
```

## Examples

**Create a product**
```json
{ "name": "Apple", "price": 0.99 }
```

**Create a basket**
```json
{ "userId": "user1", "items": [{ "productId": 1, "quantity": 2 }] }
```

**Place an order**
```json
{ "userId": "user1" }
```
