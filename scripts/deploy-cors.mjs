
import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Load .env.local manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf8");
    envConfig.split("\n").forEach((line) => {
        const [key, value] = line.split("=");
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error("Missing required environment variables in .env.local");
    process.exit(1);
}

const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
});

const corsParams = {
    Bucket: bucketName,
    CORSConfiguration: {
        CORSRules: [
            {
                AllowedHeaders: ["*"],
                AllowedMethods: ["PUT", "POST", "GET", "HEAD"],
                AllowedOrigins: ["*"], // WARNING: Allow all origins for development. Restrict in production.
                ExposeHeaders: ["ETag"],
                MaxAgeSeconds: 3000,
            },
        ],
    },
};

const command = new PutBucketCorsCommand(corsParams);

try {
    await client.send(command);
    console.log(`Successfully set CORS configuration for bucket: ${bucketName}`);
} catch (err) {
    console.error("Error setting CORS configuration:", err);
}
