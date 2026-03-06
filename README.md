# LevelShop - Modern E-Commerce UI

A high-performance, responsive e-commerce shopping app built with **React**, **Typescript**, **Zustand**, **React Hook Form** and **Tailwind CSS**.

## 🚀 Technical Stack
- **Frontend**: React 19 with TypeScript.
- **State Management**: Zustand (Global State) & React Hook Form (Form management).
- **Data Fetching**: Integration with **DummyJSON API** for dynamic product sourcing.
- **Browser APIs**: **Intersection Observer** for advanced scroll logic.
- **Styling**: Tailwind CSS.
- **Icons**: Lucide React.
- **Animations**: Framer Motion.
- **Persistence**: Zustand Persist Middleware (Automatic synchronization with LocalStorage).

## 🛠️ Key Features
- **Smart Infinite Scrolling**: Seamless product loading using the Intersection Observer API. New items are fetched automatically as the user scrolls, eliminating the need for manual pagination.
- **Hybrid Data Source**: Combines curated local data with external API results for an instantaneous "first paint" experience.
- **Dynamic Cart**: Real-time quantity updates and total price calculation.
- **Responsive Design**: Fluid layout that works perfectly on mobile, tablet, and desktop.
- **Fluid UI Transitions**: Powered by Framer Motion for an "App-like" feel when switching between Summary and Payment.
- **Advanced Payment Flow**: Multi-step checkout simulation supporting Credit Card, PayPal, and Google Pay.
- **Separated State Management**: Decoupled global state (**Zustand**) from Form logic (**React Hook Form**). This prevents unnecessary global re-renders during input and ensures sensitive payment data aren't accidentally persisted in **LocalStorage**.

## 📦 Installation & Setup
1. Clone the repository:
   ```bash
   git clone [https://github.com/Starpal/shopping-cart.git](https://github.com/Starpal/shopping-cart.git)

2. Install Dependencies
   ```bash
   npm install

3. Start the Application
   ```bash
   npm start

Developed with ❤️ by Starpal
