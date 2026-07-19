# SK Electronics - Shop Management System

A comprehensive web-based shop management system designed for electronics retailers, featuring a modern customer-facing storefront and a powerful admin dashboard.

## 🛠️ Admin Panel Guide

The Admin Panel (`/admin`) allows shop owners to manage inventory, record sales, track installments, and view customer ledgers. Below is a guide on where to find specific data entry points and what data can be recorded.

### 1. Dashboard (`frontend/app/admin/page.tsx`)
**Location:** `/admin`
- **Overview:** Displays top-level metrics such as Total Sales, Active Installments, and Recent Activity.
- **Data Displayed:** Read-only summary of the entire shop's performance.

### 2. Products Management (`frontend/app/admin/products/page.tsx`)
**Location:** `/admin/products`
- **Purpose:** Manage your shop's inventory and product catalog.
- **Data Entry (Add Product):** Click the **"Add Product"** button to open the entry form.
  - **Fields Recorded:** Product Name, Price (PKR), Initial Stock, Description, and Category.
  - **Categories:** You can select an existing category or create a completely new one on the fly.
- **Editing:** Allows updating stock levels and adjusting prices as market rates change.

### 3. Sales & Invoicing (`frontend/app/admin/sales/new/page.tsx`)
**Location:** `/admin/sales/new`
- **Purpose:** Create new invoices for cash or installment sales.
- **Data Entry (New Sale):**
  - **Step 1 (Customer):** Select an existing customer or enter details for a new customer (Name, Phone, CNIC, Address).
  - **Step 2 (Products):** Search the catalog. When adding a product, a **"Product Details Modal"** opens where you can record specific details for that sale:
    - *Unit Price Override*
    - *Serial Number / IMEI* (Crucial for electronics warranty tracking)
    - *Discount Amount*
  - **Step 3 (Payment):** Select payment method (Cash/Installment). If Installment is chosen, you can record the Down Payment and set the Installment Duration (e.g., 6, 12 months).

### 4. Installments & Payments (`frontend/app/admin/payments/page.tsx`)
**Location:** `/admin/payments`
- **Purpose:** Track all active installment plans, see who owes money, and record monthly payments.
- **Data Entry (Record Payment):** Click the **"Record Pay"** button next to any active installment plan.
  - **Fields Recorded:** Payment Amount (PKR), Payment Date, and Payment Method (Cash/Bank Transfer/Credit Card).
- **Warnings & Status:** Automatically tags plans as "Overdue", "Due Today", or "Good" so you know exactly who to follow up with.

### 5. Customers (`frontend/app/admin/customers/page.tsx`)
**Location:** `/admin/customers`
- **Purpose:** View customer profiles, their total purchase history, and outstanding ledgers.

---

## Technical Stack
- **Frontend:** Next.js 14, React, Tailwind CSS, Lucide Icons
- **Styling:** Custom Light/Dark mode with OKLCH color spaces. The Admin Panel is forced to **Light Mode** for consistent visibility and data entry focus.

## Running Locally
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) for the storefront or [http://localhost:3000/admin](http://localhost:3000/admin) for the Admin Panel.
