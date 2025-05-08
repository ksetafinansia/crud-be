"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const taskRoutes_1 = __importDefault(require("./routes/taskRoutes"));
const authMiddleware_1 = __importDefault(require("./middleware/authMiddleware"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(authMiddleware_1.default); // Apply authentication middleware to all routes
// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
    console.error('MongoDB URI is not defined in the environment variables.');
    process.exit(1);
}
mongoose_1.default.connect(mongoURI).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('MongoDB connection error:', error);
});
// Basic route
app.get('/', (req, res) => {
    res.send('Express app is running');
});
// Use taskRoutes under the /api path
app.use('/api', taskRoutes_1.default);
// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
exports.default = app;
