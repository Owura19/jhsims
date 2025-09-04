// backend/controllers/dashboardController.js

const dashboard = (req, res) => {
    res.json({
        message: `Hello ${req.user.role}, your ID is ${req.user.id}`,
        user: req.user
    });
};

module.exports = { dashboard };