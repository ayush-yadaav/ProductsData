# Sportswear Product API

A beginner-friendly REST API built with Node.js + Express. It serves the product catalog from `data/main_products.json` (278 products) and does not require a database to get started.

## 1. Requirements

- Node.js 18+ (Node.js 20+ recommended)
- npm

## 2. Run locally

```bash
npm install
```

Copy `.env.example` to `.env` if you want to customize the port or frontend origin. Then start the API:

```bash
npm run dev
```

Or use `npm start`. The API runs at `http://localhost:5000` by default.

## 3. Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API welcome and endpoint overview |
| GET | `/api` | Catalog metadata |
| GET | `/api/health` | Health check |
| GET | `/api/products` | All products, filterable and paginated |
| GET | `/api/products/:id` | One product by ID |
| GET | `/api/men` | All men's products; each product retains its `category` field |
| GET | `/api/women` | All women's products; each product retains its `category` field |
| GET | `/api/men/shoes` | Men's shoes |
| GET | `/api/men/clothing` | Men's clothing |
| GET | `/api/men/accessories` | Men's accessories |
| GET | `/api/women/shoes` | Women's shoes |
| GET | `/api/women/clothing` | Women's clothing |
| GET | `/api/women/accessories` | Women's accessories |
| GET | `/api/featured` | Featured products |
| GET | `/api/top` | Curated top products |
| GET | `/api/categories` | Available categories |

## 4. Product filters

Use these query parameters on `/api/products`, `/api/men`, `/api/women`, `/api/featured`, `/api/top`, and category endpoints where applicable. `/api/men` and `/api/women` return all matching products by default; pagination is opt-in with `page` or `limit`:

- `search` or `q` — search product name, category, gender, or color
- `category=shoes|clothing|accessories`
- `gender=men|women`
- `minPrice=1000` and `maxPrice=10000` — checks sale price when available, otherwise regular price
- `inStock=true` or `inStock=false`
- `featured=true` or `featured=false`
- `top=true` or `top=false`
- `sort=price-asc|price-desc|name-asc|discount-desc`
- `page=1` and `limit=20` (maximum limit: 100)

Examples:

```text
http://localhost:5000/api/products?gender=men&category=shoes
http://localhost:5000/api/products?search=puma&sort=price-asc
http://localhost:5000/api/products?minPrice=1000&maxPrice=5000&page=1&limit=10
http://localhost:5000/api/men/shoes?inStock=true
http://localhost:5000/api/women?featured=true
http://localhost:5000/api/products/prod-001
```

## 5. Use from frontend

```js
async function loadProducts() {
  try {
    const response = await fetch('http://localhost:5000/api/products');
    const result = await response.json();
    if (!response.ok || !result.success) throw new Error(result.message || 'Could not load products');
    console.log(result.data); // current page of products
  } catch (error) {
    console.error('API error:', error.message);
  }
}

loadProducts();
```

The list endpoints return a pagination object with `success`, `count`, `total`, `page`, `limit`, `totalPages`, and `data`. Single-product lookup returns the product in `data`.

## Notes

- Product data is read from the JSON file. This starter API does not yet support creating, editing, or deleting products, and changes made in memory are not persisted.
- `top_products` is the supplied curated list, not verified sales-ranking data.
- For a deployed production store, add validation, tests, logging, and a database/admin authentication before exposing write endpoints.

## Gender endpoint response shape

`GET /api/men` returns all 146 men's products in `data`, and `GET /api/women` returns all 132 women's products in `data`. Every product keeps its `category` field (`shoes`, `clothing`, or `accessories`), so the frontend can group products by category as needed. Add `?page=1&limit=20` when you want pagination.
