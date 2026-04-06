"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const data_source_1 = require("./lib/data-source");
dotenv_1.default.config();
const app = (0, express_1.default)();
// Initialize Database
(0, data_source_1.initializeDatabase)().catch(err => console.error("Initial DB setup failed", err));
// Middleware
app.use((0, cors_1.default)());
// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Conditionally use express.json only for methods that typically have a body
app.use((req, res, next) => {
    if (['GET', 'DELETE', 'HEAD'].includes(req.method)) {
        return next();
    }
    express_1.default.json()(req, res, next);
});
// Routes
app.use('/users', user_routes_1.default);
app.use('/products', product_routes_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});
exports.default = app;
//# sourceMappingURL=app.js.map