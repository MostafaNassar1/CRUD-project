import swaggerJsdoc from "swagger-jsdoc";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "CRUD API",
            version: "1.0.0",
            description: "A CRUD API with JWT Authentication, RBAC, Cloudinary File Upload, and Cron Jobs"
        },
        servers: [
            {
                url: "http://localhost:8000/api",
                description: "Development"
            },
            {
                url: "https://crud-project-1-303j.onrender.com/api",
                description: "Production"
            }
        ],
        tags: [
            { name: "Register", description: "User registration" },
            { name: "Auth", description: "Authentication endpoints" },
            { name: "Users", description: "User management endpoints" },
            { name: "Search & Filter", description: "Search and filter endpoints" },
            { name: "Files", description: "File upload endpoints" },
            { name: "Admin", description: "Admin only endpoints" }
        ],
        components: {
            securitySchemes: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "accessToken",
                    description: "JWT access token stored in HTTP Only Cookie"
                }
            }
        }
    },
    apis: [
        join(__dirname, "./routes/userRoute.js"),
        join(__dirname, "./routes/authRoute.js")
    ]
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;