<p align="center">
  <img src="https://img.shields.io/badge/Platirix-Food%20Ordering%20Platform-22c55e?style=for-the-badge&logo=food" alt="Platirix" />
</p>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Outfit&size=28&duration=4000&color=22C55E&center=true&vCenter=true&width=1000&height=70&lines=PLATIRIX+%7C+Premium+Food+Ordering+%26+Management;Fresh+Food%2C+Delivered+to+Your+Door" alt="Typing SVG" />
</p>

<h2 align="center">🚀 A production-grade food ordering and order management platform.</h2>

---

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-Apache%202.0-purple?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Built%20With-Express%20%7C%20Next.js%20%7C%20PostgreSQL-black?style=for-the-badge" />
</p>

---

# 🍽️ Platirix

> *Fresh Food, Delivered Fast.*  
> **Platirix** is a full-stack food ordering and order management platform built as a technical assessment demonstrating production-quality full-stack engineering practices.  
> Designed with **Next.js 14 (App Router)**, **Express.js**, **PostgreSQL**, and **Tailwind CSS** for speed, scale, and elegance.

---

# ✨ Features

- 📋 **Menu Browsing**: Browse food items categorized by type (Pizza, Burger, Sushi, Dessert, Drinks, Salad) with real-time category filtering.
- 🛒 **Cart Management**: Add items to cart, adjust quantities, remove items — all persisted server-side.
- 🧾 **Checkout Experience**: Review cart, see total, and place orders with one click.
- 📦 **Order Tracking**: Track order status through 5 stages (Pending → Confirmed → Preparing → Out for Delivery → Delivered) with live progress indicators.
- 🔄 **Live Polling**: Orders page auto-refreshes every 10 seconds for real-time status updates.
- ✅ **Input Validation**: All API inputs validated with Zod schemas.
- 🧪 **Integration Tests**: Comprehensive test suite covering menu, cart, and order flows.

---

# 💡 Why This Project?

This platform was built as a technical assessment to demonstrate:

- **Clean Architecture**: Separation of concerns with routes, controllers, models, and middleware.
- **API Design**: Consistent REST API patterns with proper error handling and response formats.
- **Database Transactions**: Atomic order creation using PostgreSQL transactions.
- **Testing**: Integration tests using Jest and Supertest covering critical business flows.
- **Monorepo Structure**: NPM workspaces for shared code management.

---

# 🧩 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Backend | Express.js |
| Language | JavaScript (Node.js) |
| Database | PostgreSQL |
| ORM / Query | Raw SQL with pg driver |
| Styling | Tailwind CSS |
| Validation | Zod |
| Testing | Jest + Supertest |
| Containerization | Docker Compose |

---

# 📂 Project Structure

```plaintext
platirix/
├── packages/
│   ├── server/                  # Express.js backend
│   │   ├── src/
│   │   │   ├── config/          # DB connection, migration, seed
│   │   │   ├── controllers/     # Route handlers (menu, cart, order)
│   │   │   ├── middleware/      # Error handler, validation
│   │   │   ├── models/          # Data access layer (Menu, Cart, Order)
│   │   │   ├── routes/          # Express route definitions
│   │   │   └── index.js         # App entry point
│   │   └── tests/               # Jest integration tests
│   └── web/                     # Next.js frontend
│       ├── app/                 # App Router pages
│       │   ├── cart/            # Cart page
│       │   ├── checkout/        # Checkout page
│       │   ├── orders/          # Orders list + detail
│       │   └── page.jsx         # Home / Menu page
│       ├── components/          # Reusable components
│       ├── styles/              # Tailwind CSS globals
│       └── public/              # Static assets
├── docker-compose.yml           # PostgreSQL container
├── .env.example                 # Environment template
└── README.md                    # Documentation
```

---

# ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/Cipher-Shadow-IR/Platirix.git

# Enter folder
cd Platirix

# Install dependencies (root + all workspaces)
npm install
```

---

# ▶️ Run Locally

### 1. Start Database via Docker

```bash
docker-compose up -d
```

This starts a PostgreSQL 16 instance on port 5432.

### 2. Configure Environment

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

### 3. Run Database Migrations

```bash
npm run db:migrate
```

### 4. Seed the Database

```bash
npm run db:seed
```

This creates 6 categories and 15 menu items across Pizza, Burger, Sushi, Dessert, Drinks, and Salad.

### 5. Start Development Servers

```bash
npm run dev
```

This starts both the backend (port 4000) and frontend (port 3000) concurrently.

---

# 🔐 Environment Variables

```env
DATABASE_URL="postgresql://platirix:platirix@localhost:5432/platirix?schema=public"
PORT=4000
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

---

# 🧠 How It Works

1. **Browse Menu**: Users explore food items on the home page, filtered by category.
2. **Add to Cart**: Click "Add to Cart" on any item; adjust quantities on the Cart page.
3. **Checkout**: Review the cart summary and place the order.
4. **Order Tracking**: Track order progress through fulfillment stages with visual progress bars.

---

# 📬 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/menu` | List menu items (optional `?category=` filter) |
| GET | `/api/menu/:id` | Get menu item by ID |
| POST | `/api/menu` | Create menu item |
| GET | `/api/cart` | List cart items |
| POST | `/api/cart` | Add item to cart |
| PATCH | `/api/cart/:id` | Update cart item quantity |
| DELETE | `/api/cart/:id` | Remove item from cart |
| GET | `/api/orders` | List orders |
| GET | `/api/orders/:id` | Get order details |
| POST | `/api/orders` | Create order from cart |
| PATCH | `/api/orders/:id/status` | Update order status |

---

# 🧪 Testing

Run the backend integration test suite:

```bash
npm test
```

Tests cover:
- Health endpoint
- Menu CRUD and validation
- Cart add, update, remove operations
- Order creation from cart, status updates, and validation

---

# 🚀 Roadmap

* [x] Monorepo structure with npm workspaces
* [x] Menu service with categories
* [x] Cart management workflow
* [x] Order creation API with transactions
* [x] Checkout experience
* [x] Order tracking with live progress
* [x] Integration tests
* [x] Documentation and architecture notes
* [ ] User authentication (OAuth / JWT)
* [ ] Admin dashboard for order management
* [ ] Payment gateway integration
* [ ] Real-time WebSocket updates

---

# 📈 Future Improvements

* Real-time order updates via WebSocket/Socket.IO
* User authentication with JWT
* Admin dashboard for managing menu and orders
* Payment integration (Stripe)
* Email notifications for order status changes
* Pagination for menu and orders

---

# 📜 License

Apache License 2.0

---

## 💬 Author

<p align="center">
  <b>Built by Ishaan Ray (Cipher Shadow IR)</b><br>
  <i>"Fresh Food, Delivered Fast."</i><br><br>
  <a href="https://github.com/Cipher-Shadow-IR" target="_blank">
    <img src="https://img.shields.io/badge/GitHub-Cipher%20Shadow%20IR-181717?style=for-the-badge&logo=github" />
  </a>
</p>

---

# ⭐ Support

If you liked this project:

```md
Give it a star ⭐
```
