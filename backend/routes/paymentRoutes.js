const express = require("express");
const router = express.Router();
const { payHereNotify } = require("../controllers/paymentController");

router.post("/notify", payHereNotify);

module.exports = router;
