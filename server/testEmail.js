import dotenv from "dotenv";
dotenv.config();

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);

import sendEmail from "./utils/sendEmail.js";

await sendEmail(
    process.env.EMAIL_USER,
    "Testing Nodemailer",
    "<h1>Hello Mostafa!</h1>"
);

console.log("Finished");