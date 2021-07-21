const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer");

router.route("/customers").get(customerController.getCustomers);

router.route("/customer/:id").get(customerController.getSingleCustomer);

router.route("/customer/:id/transfer").post(customerController.postTransfer);

router.route("/transfers").get(customerController.getTransfer);



module.exports = router;
