const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

dotenv.config();

const app = express();

app.use(cors());

// Stripe webhook needs raw body; we will mount it on specific route before json parser
const bodyParser = require("body-parser");
const { webhookHandler } = require("./routes/paymentRoutes");
app.post("/api/payments/webhook", bodyParser.raw({ type: "application/json" }), webhookHandler);

app.use(express.json());

const connectDB = require("./config/db");
connectDB();

// Serve static files from the React app build directory
app.use(express.static(path.join(__dirname, '../Frontend/build')));

app.get("/", (req, res) => {
  res.send("Invoice generator API Running");
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const clientRoutes = require("./routes/clientRoutes");
app.use("/api/clients", clientRoutes);

const invoiceRoutes = require("./routes/invoiceRoutes");
app.use("/api/invoices", invoiceRoutes);

const dashboardRoutes = require("./routes/dashboard");
app.use("/api/dashboard", dashboardRoutes);

// Public and payment routes
const publicRoutes = require("./routes/publicRoutes");
app.use("/api/public", publicRoutes);

const { paymentRouter } = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRouter);

// Middleware to serve React app for non-API routes (for SPA client-side routing)
app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) {
    return res.sendFile(path.join(__dirname, '../Frontend/build/index.html'));
  }
  next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
