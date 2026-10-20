// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const catalog = require('./data/main_products.json');

// const app = express();
// const PORT = Number(process.env.PORT) || 5000;

// const allowedOrigin = process.env.CLIENT_ORIGIN || '*';
// app.use(cors({ origin: allowedOrigin === '*' ? '*' : allowedOrigin.split(',').map(v => v.trim()) }));
// app.use(express.json());

// const products = catalog.allProducts || [];
// const validGenders = ['men', 'women'];
// const validCategories = ['shoes', 'clothing', 'accessories'];

// function boolParam(value) {
//   if (value === undefined) return undefined;
//   if (['true', '1', 'yes'].includes(String(value).toLowerCase())) return true;
//   if (['false', '0', 'no'].includes(String(value).toLowerCase())) return false;
//   return undefined;
// }

// function filterProducts(list, query) {
//   let result = [...list];
//   const gender = String(query.gender || '').toLowerCase();
//   const category = String(query.category || '').toLowerCase();
//   const search = String(query.search || query.q || '').trim().toLowerCase();
//   const featured = boolParam(query.featured);
//   const top = boolParam(query.top);
//   const inStock = boolParam(query.inStock);
//   const minPrice = query.minPrice === undefined ? undefined : Number(query.minPrice);
//   const maxPrice = query.maxPrice === undefined ? undefined : Number(query.maxPrice);

//   if (validGenders.includes(gender)) result = result.filter(p => p.gender === gender);
//   if (validCategories.includes(category)) result = result.filter(p => p.category === category);
//   if (search) result = result.filter(p => [p.name, p.category, p.gender, p.color].some(v => String(v || '').toLowerCase().includes(search)));
//   if (featured !== undefined) result = result.filter(p => Boolean(p.isFeatured) === featured);
//   if (top !== undefined) result = result.filter(p => Boolean(p.isTop) === top);
//   if (inStock !== undefined) result = result.filter(p => Boolean(p.inStock) === inStock);
//   if (query.minPrice !== undefined && Number.isFinite(minPrice)) result = result.filter(p => Number(p.salePrice ?? p.price) >= minPrice);
//   if (query.maxPrice !== undefined && Number.isFinite(maxPrice)) result = result.filter(p => Number(p.salePrice ?? p.price) <= maxPrice);

//   const sort = String(query.sort || '').toLowerCase();
//   if (sort === 'price-asc') result.sort((a, b) => Number(a.salePrice ?? a.price) - Number(b.salePrice ?? b.price));
//   else if (sort === 'price-desc') result.sort((a, b) => Number(b.salePrice ?? b.price) - Number(a.salePrice ?? a.price));
//   else if (sort === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));
//   else if (sort === 'discount-desc') result.sort((a, b) => Number(b.discount || 0) - Number(a.discount || 0));
//   return result;
// }

// function paginatedResponse(list, query) {
//   const page = Math.max(1, parseInt(query.page, 10) || 1);
//   const requestedLimit = parseInt(query.limit, 10) || 20;
//   const limit = Math.min(100, Math.max(1, requestedLimit));
//   const total = list.length;
//   const start = (page - 1) * limit;
//   return {
//     success: true,
//     count: Math.min(limit, Math.max(0, total - start)),
//     total,
//     page,
//     limit,
//     totalPages: Math.ceil(total / limit),
//     data: list.slice(start, start + limit)
//   };
// }

// function sendProductList(res, list, query) {
//   return res.json(paginatedResponse(filterProducts(list, query), query));
// }

// app.get('/', (_req, res) => {
//   res.json({
//     success: true,
//     message: 'Sportswear Product API is running',
//     products: products.length,
//     endpoints: {
//       allProducts: '/api/products',
//       productById: '/api/products/:id',
//       men: '/api/men',
//       women: '/api/women',
//       featured: '/api/featured',
//       top: '/api/top',
//       categories: '/api/categories',
//       health: '/api/health'
//     }
//   });
// });

// app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok' }));
// app.get('/api', (_req, res) => res.json({ success: true, name: catalog.name, description: catalog.description, totalProducts: products.length }));
// app.get('/api/categories', (_req, res) => res.json({ success: true, data: validCategories }));

// app.get('/api/products', (req, res) => sendProductList(res, products, req.query));
// app.get('/api/products/:id', (req, res) => {
//   const product = products.find(p => String(p.id) === req.params.id);
//   if (!product) return res.status(404).json({ success: false, message: `Product '${req.params.id}' not found` });
//   return res.json({ success: true, data: product });
// });

// function sendGenderLanding(res, gender, query) {
//   const genderProducts = (catalog[gender] || products.filter(p => p.gender === gender));
//   // Keep each product's own category field, and return every product by default.
//   // Pagination is opt-in: /api/men?page=1&limit=20
//   const filtered = filterProducts(genderProducts, { ...query, gender: undefined });
//   const paginationRequested = query.page !== undefined || query.limit !== undefined;

//   if (paginationRequested) {
//     const paginated = paginatedResponse(filtered, query);
//     return res.json({
//       success: true,
//       gender,
//       totalProducts: genderProducts.length,
//       categories: validCategories,
//       ...paginated
//     });
//   }

//   return res.json({
//     success: true,
//     gender,
//     totalProducts: genderProducts.length,
//     categories: validCategories,
//     count: filtered.length,
//     data: filtered
//   });
// }

// // /api/men and /api/women return all products for that gender by default.
// // Each product keeps its category (shoes, clothing, or accessories).
// app.get('/api/men', (req, res) => sendGenderLanding(res, 'men', req.query));
// app.get('/api/women', (req, res) => sendGenderLanding(res, 'women', req.query));
// app.get('/api/featured', (req, res) => sendProductList(res, catalog.featuredProducts || products.filter(p => p.isFeatured), req.query));
// app.get('/api/top', (req, res) => sendProductList(res, catalog.topProducts || products.filter(p => p.isTop), req.query));

// app.get('/api/men/:category', (req, res, next) => {
//   const category = req.params.category.toLowerCase();
//   if (!validCategories.includes(category)) return next();
//   const list = (catalog.menByCategory && catalog.menByCategory[category]) || products.filter(p => p.gender === 'men' && p.category === category);
//   return sendProductList(res, list, { ...req.query, gender: undefined, category: undefined });
// });
// app.get('/api/women/:category', (req, res, next) => {
//   const category = req.params.category.toLowerCase();
//   if (!validCategories.includes(category)) return next();
//   const list = (catalog.womenByCategory && catalog.womenByCategory[category]) || products.filter(p => p.gender === 'women' && p.category === category);
//   return sendProductList(res, list, { ...req.query, gender: undefined, category: undefined });
// });

// app.use((req, res) => res.status(404).json({ success: false, message: `Route '${req.method} ${req.originalUrl}' not found` }));
// app.use((err, _req, res, _next) => {
//   console.error(err);
//   res.status(500).json({ success: false, message: 'Internal server error' });
// });

// app.listen(PORT, () => console.log(`Sportswear API running at http://localhost:${PORT}`));


require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = Number(process.env.PORT) || 5000;
const DATA_DIR = path.join(__dirname, 'data');
const allowedOrigin = process.env.CLIENT_ORIGIN || '*';
app.use(cors({ origin: allowedOrigin === '*' ? '*' : allowedOrigin.split(',').map(v => v.trim()) }));
app.use(express.json());

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, relativePath), 'utf8'));
}
const categories = ['shoes', 'clothing', 'accessories'];
const allProducts = readJson('all-products.json');
const menProducts = readJson('men.json');
const womenProducts = readJson('women.json');
const featuredProducts = readJson('featured.json');
const topProducts = readJson('top.json');
const routeData = {
  men: { all: menProducts, shoes: readJson('men/shoes.json'), clothing: readJson('men/clothing.json'), accessories: readJson('men/accessories.json') },
  women: { all: womenProducts, shoes: readJson('women/shoes.json'), clothing: readJson('women/clothing.json'), accessories: readJson('women/accessories.json') }
};

function boolParam(value) {
  if (value === undefined) return undefined;
  if (['true', '1', 'yes'].includes(String(value).toLowerCase())) return true;
  if (['false', '0', 'no'].includes(String(value).toLowerCase())) return false;
  return undefined;
}
function filterProducts(list, query = {}) {
  let result = [...list];
  const search = String(query.search || query.q || '').trim().toLowerCase();
  const featured = boolParam(query.featured);
  const top = boolParam(query.top);
  const inStock = boolParam(query.inStock);
  const minPrice = query.minPrice === undefined ? undefined : Number(query.minPrice);
  const maxPrice = query.maxPrice === undefined ? undefined : Number(query.maxPrice);
  const category = String(query.category || '').toLowerCase();
  const gender = String(query.gender || '').toLowerCase();
  if (categories.includes(category)) result = result.filter(p => p.category === category);
  if (['men', 'women'].includes(gender)) result = result.filter(p => p.gender === gender);
  if (search) result = result.filter(p => [p.name,p.brand,p.category,p.gender,p.color,...(p.tags || [])].some(v => String(v || '').toLowerCase().includes(search)));
  if (featured !== undefined) result = result.filter(p => Boolean(p.isFeatured) === featured);
  if (top !== undefined) result = result.filter(p => Boolean(p.isTop) === top);
  if (inStock !== undefined) result = result.filter(p => Boolean(p.inStock) === inStock);
  if (query.minPrice !== undefined && Number.isFinite(minPrice)) result = result.filter(p => Number(p.salePrice ?? p.price) >= minPrice);
  if (query.maxPrice !== undefined && Number.isFinite(maxPrice)) result = result.filter(p => Number(p.salePrice ?? p.price) <= maxPrice);
  const sort = String(query.sort || '').toLowerCase();
  if (sort === 'price-asc') result.sort((a,b) => Number(a.salePrice ?? a.price)-Number(b.salePrice ?? b.price));
  else if (sort === 'price-desc') result.sort((a,b) => Number(b.salePrice ?? b.price)-Number(a.salePrice ?? a.price));
  else if (sort === 'name-asc') result.sort((a,b) => a.name.localeCompare(b.name));
  else if (sort === 'discount-desc') result.sort((a,b) => Number(b.discount || 0)-Number(a.discount || 0));
  return result;
}
function responseList(list, query = {}) {
  const filtered = filterProducts(list, query);
  const page = Math.max(1, parseInt(query.page,10) || 1);
  const requestedLimit = query.limit === undefined ? filtered.length : (parseInt(query.limit,10) || 20);
  const limit = Math.min(1000, Math.max(1, requestedLimit));
  const start = query.page === undefined && query.limit === undefined ? 0 : (page-1)*limit;
  return { success:true, count:Math.min(limit,Math.max(0,filtered.length-start)), total:filtered.length, page, limit, totalPages:Math.ceil(filtered.length/limit), data:filtered.slice(start,start+limit) };
}
function sendList(res,list,query) { return res.json(responseList(list,query)); }
app.get('/', (_req,res) => res.json({success:true,message:'Sportswear Product API is running',totalProducts:allProducts.length,endpoints:{allProducts:'/api/products',productById:'/api/products/:id',men:'/api/men',women:'/api/women',featured:'/api/featured',top:'/api/top',categories:'/api/categories',health:'/api/health'}}));
app.get('/api/health',(_req,res)=>res.json({success:true,status:'ok'}));
app.get('/api',(_req,res)=>res.json({success:true,name:'Sportswear Product API',totalProducts:allProducts.length,totalMenProducts:menProducts.length,totalWomenProducts:womenProducts.length}));
app.get('/api/categories',(_req,res)=>res.json({success:true,data:categories}));
app.get('/api/products',(req,res)=>sendList(res,allProducts,req.query));
app.get('/api/products/:id',(req,res)=>{const product=allProducts.find(p=>String(p.id)===req.params.id);if(!product)return res.status(404).json({success:false,message:`Product '${req.params.id}' not found`});return res.json({success:true,data:product});});
app.get('/api/men',(req,res)=>sendList(res,routeData.men.all,req.query));
app.get('/api/women',(req,res)=>sendList(res,routeData.women.all,req.query));
app.get('/api/featured',(req,res)=>sendList(res,featuredProducts,req.query));
app.get('/api/top',(req,res)=>sendList(res,topProducts,req.query));
for (const gender of ['men','women']) {
  app.get(`/api/${gender}/:category`,(req,res,next)=>{
    const category=String(req.params.category).toLowerCase();
    if (!categories.includes(category)) return next();
    return sendList(res,routeData[gender][category],req.query);
  });
}
app.use((req,res)=>res.status(404).json({success:false,message:`Route '${req.method} ${req.originalUrl}' not found`}));
app.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({success:false,message:'Internal server error'});});
app.listen(PORT,()=>console.log(`Sportswear API running at http://localhost:${PORT}`));
