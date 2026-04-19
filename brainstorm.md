# 🍝 Recipe Web Application — Architecture & Roadmap (with Polar Subscriptions)

## 1. Product Summary

A web application where:

- Admin creates and manages recipe content
- Recipes are grouped into categories (Italian, Indian, etc.)
- Recipes are marked as **FREE** or **PREMIUM**
- Users can browse and search recipes
- Premium recipes require:
  - user account
  - active subscription via **Polar**

### Responsibility Split

| System | Responsibility |
|------|--------|
| Your App | Recipes, categories, users, access control |
| Polar | Payments, subscriptions, billing lifecycle |

---

# 2. Actors

## Admin
- Manage categories
- Manage recipes
- Upload images
- Mark recipes free/premium
- View users & subscription status

## Guest
- Browse free recipes
- Search recipes
- View locked premium previews

## Registered User (No Subscription)
- Login
- Browse/search recipes
- View free recipes
- See locked premium content
- Start subscription

## Subscriber
- Full access to all recipes
- Manage billing via Polar portal

---

# 3. Core Modules

## A. Authentication & Authorization
- Register
- Login / Logout
- Password hashing
- JWT/session auth
- Role-based access (ADMIN, USER)
- Route protection

---

## B. User Management

### Fields
- id
- name
- email
- password_hash
- role
- polar_customer_id
- created_at
- updated_at

---

## C. Category Management

### Fields
- id
- name
- slug
- description
- image_url
- created_at

### Functions
- Create / Edit / Delete categories
- List categories

---

## D. Recipe Management

### Fields
- id
- title
- slug
- short_description
- description
- ingredients_text
- steps_text
- prep_time
- cook_time
- servings
- difficulty
- category_id
- access_type (FREE / PREMIUM)
- is_published
- is_featured
- image_url

### Functions
- Create / Edit / Delete recipes
- Assign category
- Upload images
- Publish/unpublish
- Mark free or premium

---

## E. Public Discovery

### Features
- Homepage (featured recipes)
- Search recipes
- Browse categories
- Recipe detail pages
- Premium lock overlay

---

## F. Polar Subscription Integration

### Responsibilities
- Create Polar customer
- Start checkout session
- Handle webhooks
- Sync subscription state
- Provide customer portal link

### Important Rule
- Polar = billing source of truth
- Your backend = access control

---

## G. Premium Access Control

### Rules

| User | Free | Premium |
|------|------|--------|
| Guest | ✅ | ❌ |
| Logged-in | ✅ | ❌ |
| Subscriber | ✅ | ✅ |
| Admin | ✅ | ✅ |

### UI Behavior
- Premium content blurred
- CTA: "Subscribe to unlock"

### Security Rule
Backend MUST enforce access (not frontend only)

---

## H. Webhook Processing

### Responsibilities
- Receive Polar webhooks
- Verify signature
- Update subscription status
- Store audit logs

### Events
- Subscription created
- Subscription renewed
- Subscription canceled
- Payment failed
- Checkout completed

---

## I. Admin Dashboard

### Features
- Total recipes
- Total users
- Subscriber count
- Recent activity
- Manage content

---

# 4. User Flows

## Admin Creates Recipe
1. Login
2. Create category
3. Create recipe
4. Assign category
5. Mark free/premium
6. Publish

---

## Guest Searches Recipe
1. Search
2. Open recipe

- Free → full view
- Premium → locked preview

---

## User Subscribes
1. Register & login
2. Click premium recipe
3. Click "Subscribe"
4. Redirect to Polar checkout
5. Complete payment
6. Webhook updates subscription
7. Access unlocked

---

## Subscriber Access
1. Login
2. Open premium recipe
3. Backend validates access
4. Full content shown

---

# 5. Functional Requirements

## Public
- Homepage
- Search
- Browse categories
- View recipes
- Register / login

## User
- Manage account
- Subscribe
- Access premium content

## Admin
- Manage categories
- Manage recipes
- View users
- Monitor subscriptions

---

# 6. Database Design

## users
- id
- email
- password_hash
- role
- polar_customer_id

## categories
- id
- name
- slug
- description

## recipes
- id
- title
- description
- ingredients
- steps
- access_type
- category_id

## subscriptions
- id
- user_id
- polar_subscription_id
- status
- period_start
- period_end

## billing_events
- id
- event_type
- payload
- processed

---

# 7. Polar Product Model

## One Product

**"Recipe Premium Membership"**

### Why
- Simpler
- Scalable
- Matches use case

### Avoid
❌ One product per recipe

---

# 8. API Design

## Auth
- POST /api/auth/register
- POST /api/auth/login

## Categories
- GET /api/categories
- POST /api/admin/categories

## Recipes
- GET /api/recipes
- GET /api/recipes/{slug}
- POST /api/admin/recipes

## Billing
- POST /api/billing/checkout-session
- POST /api/billing/webhook
- GET /api/billing/status
- POST /api/billing/portal-link

---

# 9. Frontend Structure

## Public
- /
- /recipes
- /recipes/[slug]
- /categories/[slug]
- /login
- /register

## User
- /account
- /subscription

## Admin
- /admin
- /admin/recipes
- /admin/categories

---

# 10. MVP Scope

## Must Have
- Auth
- Category CRUD
- Recipe CRUD
- Free vs premium flag
- Search
- Premium locking
- Polar checkout
- Webhook sync
- Subscription enforcement

---

# 11. Build Phases

## Phase 1
- Auth
- Database
- Basic setup

## Phase 2
- Categories
- Recipes
- Public browsing

## Phase 3
- Polar integration
- Checkout
- Webhooks
- Access control

## Phase 4
- Security
- Logging
- Performance

## Phase 5
- Enhancements
- SEO
- Analytics
- Features

---

# 12. Technical Stack

## Frontend
- Next.js
- React
- Tailwind CSS

## Backend
- Spring Boot
- Spring Security
- JPA/Hibernate

## Database
- PostgreSQL

## Billing
- Polar

---

# 13. Key Design Decisions

## Subscription Model
- Single premium membership

## Identity Mapping
- Store `polar_customer_id` in user table

## Image Storage
- MVP: local filesystem
- Later: object storage (MinIO)

## Search
- MVP: PostgreSQL
- Later: full-text search

---

# 14. Risks & Edge Cases

## Billing
- Delayed webhooks
- Duplicate events
- Payment failure

## Security
- Exposed premium content
- Weak auth
- Missing webhook validation

## UX
- Confusing premium/free boundaries
- Poor search results

---

# 15. Build Strategy

## Step 1
Build full app WITHOUT billing

## Step 2
Add Polar:
- checkout
- webhook
- access control

---

# 16. Final Blueprint

> A recipe platform where admin publishes categorized recipes, users browse and search content, premium recipes are locked behind a subscription, and Polar manages billing, subscriptions, and customer lifecycle.

---

# 🚀 Summary

- Clean separation of concerns
- No custom payment logic
- Scalable subscription model
- Production-ready architecture
- MVP-first approach

---
