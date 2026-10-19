# 👟 AyuGear API

AyuGear API is a RESTful product API for a sportswear e-commerce application. It provides product data for men's and women's collections, including shoes, clothing, accessories, featured products, and top picks.

🌐 **Live API:** [https://ayugear.onrender.com/](https://ayugear.onrender.com/)

## ✨ Features

- 🛍️ Retrieve all products and individual product details
- 👨 Browse men's products and their categories
- 👩 Browse women's products and their categories
- 👟 Filter products by shoes, clothing, and accessories
- ⭐ Retrieve featured products
- 🔥 Retrieve top products
- 🔎 Search products by name
- 💰 Filter products by price range
- 📦 Filter products by stock availability
- ↕️ Sort products by price, discount, or name
- 📄 Pagination for product listings
- ☁️ Deployed on Render

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Backend:** Express.js
- **Data Format:** JSON
- **Deployment:** Render
- **Version Control:** Git & GitHub

## 🌐 Base URL

```text
https://ayugear.onrender.com
```

All endpoints below use this base URL.

## 📌 API Endpoints

### General

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API home or status |
| GET | `/api` | API information |
| GET | `/api/health` | Health check |
| GET | `/api/products` | Retrieve products |
| GET | `/api/products/:id` | Retrieve a product by ID |
| GET | `/api/categories` | Retrieve available categories |
| GET | `/api/featured` | Retrieve featured products |
| GET | `/api/top` | Retrieve top products |

### Men's Collection

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/men` | All men's products |
| GET | `/api/men/categories` | Men's products grouped by category |
| GET | `/api/men/shoes` | Men's shoes |
| GET | `/api/men/clothing` | Men's clothing |
| GET | `/api/men/accessories` | Men's accessories |

### Women's Collection

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/women` | All women's products |
| GET | `/api/women/categories` | Women's products grouped by category |
| GET | `/api/women/shoes` | Women's shoes |
| GET | `/api/women/clothing` | Women's clothing |
| GET | `/api/women/accessories` | Women's accessories |

## 🔍 Query Parameters

The product listing endpoint supports filtering and sorting.

| Parameter | Example | Purpose |
|---|---|---|
| `search` | `?search=puma` | Search by product name |
| `gender` | `?gender=men` | Filter by gender |
| `category` | `?category=shoes` | Filter by category |
| `featured` | `?featured=true` | Show featured products |
| `top` | `?top=true` | Show top products |
| `inStock` | `?inStock=true` | Show available products |
| `minPrice` | `?minPrice=1000` | Minimum price |
| `maxPrice` | `?maxPrice=5000` | Maximum price |
| `sort` | `?sort=price-asc` | Sort products |
| `page` | `?page=1&limit=10` | Paginate results |

### Example: Combine Filters

```http
GET /api/products?gender=men&category=shoes&maxPrice=5000&sort=price-asc
```

This requests men's shoes up to ₹5,000, sorted by ascending price.

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/ayush-yadaav/ProductsData.git
```

### 2. Navigate to the project

```bash
cd ProductsData
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm start
```

The API will run at the local address configured by your server, typically:

```text
http://localhost:5000
```

## 💻 Usage Example

Fetch all products using JavaScript:

```javascript
const API_URL = "https://ayugear.onrender.com";

async function getProducts() {
  try {
    const response = await fetch(`${API_URL}/api/products`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const result = await response.json();

    console.log(result.data);
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
}

getProducts();
```

### Fetch Men's Products

```javascript
async function getMenProducts() {
  const response = await fetch(
    "https://ayugear.onrender.com/api/men"
  );

  const result = await response.json();

  console.log(result.data);
}

getMenProducts();
```

### Fetch Featured Products

```javascript
async function getFeaturedProducts() {
  const response = await fetch(
    "https://ayugear.onrender.com/api/featured"
  );

  const result = await response.json();

  console.log(result.data);
}

getFeaturedProducts();
```

## 📦 Product Data Structure

Products contain fields such as:

```json
{
  "id": "example-id",
  "name": "Example Sportswear Product",
  "category": "shoes",
  "price": 4999,
  "salePrice": 3999,
  "discount": 20,
  "color": "White",
  "inStock": true,
  "image": "https://example.com/product.jpg",
  "sizes": [7, 8, 9, 10],
  "gender": "men",
  "isFeatured": true,
  "isTop": false
}
```

This is an illustrative example of the product schema; actual values depend on the stored product data.

## ☁️ Deployment

AyuGear API is hosted on Render.

**Production URL:** [https://ayugear.onrender.com/](https://ayugear.onrender.com/)

Use the production URL in your frontend instead of your local development URL.

Note: Free hosting services may take longer to respond after a period of inactivity.

## 🎯 Project Goals

AyuGear API demonstrates how to organize product data and expose it through REST endpoints for an e-commerce frontend. It can be used to practice API integration, product filtering, category navigation, and dynamic product listings.

## 👨‍💻 Author

**Ayush Yadav**

GitHub: [@ayush-yadaav](https://github.com/ayush-yadaav)

---

⭐ If you find this project useful, consider starring the repository.
