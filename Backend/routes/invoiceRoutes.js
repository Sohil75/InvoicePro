const express = require('express');
const router = express.Router();

const {
    createInvoice,getInvoices,getInvoicesById,updateInvoice,deleteInvoice,
    getMonthly
}=require('../controllers/InvoiceController');

const auth = require("../middleware/authMiddleware");

router.use(auth);
router.post('/',createInvoice);
router.get('/',getInvoices);
router.get('/monthly',getMonthly);
router.get('/:id',getInvoicesById);
router.put('/:id',updateInvoice);
router.delete('/:id',deleteInvoice);

module.exports = router;