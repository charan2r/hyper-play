const express = require("express");
const router = express.Router();
const { createWebhook } = require("../controllers/paymentController");

router.post("/webhook", createWebhook);

module.exports = router;
