# Platirix — Architecture Notes

## Overview

Platirix is a two-package monorepo (npm workspaces) with a decoupled Express.js backend and Next.js frontend. The backend exposes a REST API consumed by the frontend. PostgreSQL is used as the database, accessed via the `pg` driver with raw SQL.

## Architecture Decisions

### Monorepo with npm Workspaces
- **Why**: Shared tooling and scripts, single `npm install`, clean separation of concerns.
- **Trade-off**: Simpler than Turborepo or Nx; no caching layer.

### Backend: Express.js with Raw SQL
- **Why**: Lightweight, full control over queries, no ORM overhead for a focused CRUD app.
- **Pattern**: Routes → Controllers → Models (data access) → PostgreSQL.
- **Validation**: Zod schemas validated in middleware before reaching controllers.

### Frontend: Next.js 14 App Router
- **Why**: Modern React patterns, server components by default, file-based routing.
- **Client Components**: All pages use `"use client"` for interactive state (cart, orders, checkout).
- **Styling**: Tailwind CSS for utility-first responsive design.

### Database: PostgreSQL
- **Schema**: 5 tables — `categories`, `menu_items`, `cart_items`, `orders`, `order_items`.
- **Transactions**: Order creation uses a `BEGIN/COMMIT` transaction to atomically create the order, insert items, and clear the cart.
- **Constraints**: CHECK constraints on price (> 0), quantity (> 0), status (enum-like), and ON DELETE CASCADE on foreign keys.

### REST API Design
- **Consistent Response Format**: `{ success: boolean, data?: any, error?: { message: string } }`
- **HTTP Status Codes**: 200 (OK), 201 (Created), 400 (Validation), 404 (Not Found), 500 (Server Error).
- **Error Handling**: Centralized error handler middleware catches and formats all errors.

## Data Flow

```
User (Browser) → Next.js (Client) → fetch() → Express API → PostgreSQL
                                                        ↓
                                              Zod Validation Middleware
                                                        ↓
                                              Controller → Model → DB
```

## Key Workflows

### Order Creation (Transactional)
1. GET cart items with menu item details
2. Validate cart is not empty
3. Calculate total from cart items
4. BEGIN transaction
5. INSERT order with calculated total
6. INSERT order_items for each cart item
7. DELETE all cart_items
8. COMMIT transaction
9. Return order with items

### Order Tracking (Live Polling)
- Orders page polls `GET /api/orders` every 10 seconds.
- Progress bar calculated from status position in `[pending, confirmed, preparing, out_for_delivery, delivered]`.
- Individual order detail page polls `GET /api/orders/:id` for granular tracking.

## Testing Strategy

- **Framework**: Jest + Supertest
- **Approach**: Integration tests against the actual Express app with a real database.
- **Setup**: `setup.js` applies schema before all tests, cleans up after.
- **Coverage**: Health, menu CRUD + validation, cart CRUD + validation, order creation + status updates + validation.
