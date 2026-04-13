const { Parser } = require('json2csv');
const Transaction = require('../models/Transaction');
const Order = require('../models/Order');

exports.exportAdminReport = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('order_id', 'status payment_status')
            .populate('seller_id', 'store name')
            .sort({ createdAt: -1 });

        const data = transactions.map(t => ({
            Date: t.createdAt.toISOString().split('T')[0],
            OrderID: t.order_id?._id || 'N/A',
            Store: t.seller_id?.store || 'N/A',
            Seller: t.seller_id?.name || 'N/A',
            Type: t.type,
            GrossAmount: t.gross_amount,
            Commission: t.commission_amount,
            NetAmount: t.net_amount,
            Status: t.status
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment(`admin-full-report-${Date.now()}.csv`);
        return res.send(csv);

    } catch (error) {
        console.error("Admin Export Error:", error);
        res.status(500).json({ error: "Failed to generate report" });
    }
};

exports.exportSellerReport = async (req, res) => {
    const { sellerId } = req.params;
    try {
        const transactions = await Transaction.find({ seller_id: sellerId })
            .populate('order_id', 'status')
            .sort({ createdAt: -1 });

        const data = transactions.map(t => ({
            Date: t.createdAt.toISOString().split('T')[0],
            OrderID: t.order_id?._id || 'N/A',
            Type: t.type,
            GrossAmount: t.gross_amount,
            Commission: t.commission_amount,
            Earnings: t.net_amount,
            Status: t.status
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        res.header('Content-Type', 'text/csv');
        res.attachment(`seller-earnings-report-${Date.now()}.csv`);
        return res.send(csv);

    } catch (error) {
        console.error("Seller Export Error:", error);
        res.status(500).json({ error: "Failed to generate report" });
    }
};
