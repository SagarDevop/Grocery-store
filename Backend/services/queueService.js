const Queue = require('bull');
const { sendOrderConfirmation, sendOrderStatusUpdate, sendAbandonedCartEmail } = require('./emailService');
const User = require('../models/User');
const Cart = require('../models/Cart');

// 1. Email Queue
const emailQueue = new Queue('email-notifications', process.env.REDIS_URL || 'redis://localhost:6379');

// 2. Report Queue
const reportQueue = new Queue('reports', process.env.REDIS_URL || 'redis://localhost:6379');

// Email Worker
emailQueue.process(async (job) => {
    const { type, data } = job.data;
    try {
        console.log(`📦 Processing background task: ${type}`);
        
        if (type === 'ORDER_CONFIRMATION') {
            await sendOrderConfirmation(data.email, data.order);
        } else if (type === 'STATUS_UPDATE') {
            await sendOrderStatusUpdate(data.email, data.orderId, data.status);
        } else if (type === 'ABANDONED_CART') {
            // Check if cart still has items and user hasn't bought anything
            const cart = await Cart.findOne({ userId: data.userId });
            const user = await User.findById(data.userId);
            if (cart && cart.items.length > 0 && user) {
                await sendAbandonedCartEmail(user.email, user.name, cart.items);
            }
        }
        
    } catch (err) {
        console.error(`❌ Background Job Error [${type}]:`, err);
        throw err;
    }
});

module.exports = {
    emailQueue,
    reportQueue
};
