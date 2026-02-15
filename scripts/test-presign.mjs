import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Manually load .env.local
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
} else {
    console.error(".env.local file not found at", envPath);
    process.exit(1);
}

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME;

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error("Missing R2 environment variables");
    process.exit(1);
}

const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId,
        secretAccessKey,
    },
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
});

console.log("\nAttempting to generate Signed URL...");
const putCommand = new PutObjectCommand({
    Bucket: bucketName,
    Key: "test-checksum-check.jpg",
    ContentType: "image/jpeg",
});

try {
    const signedUrl = await getSignedUrl(client, putCommand, { expiresIn: 3600 });
    console.log("Signed URL:", signedUrl);

    if (signedUrl.includes("x-amz-checksum") || signedUrl.includes("x-amz-sdk-checksum-algorithm")) {
        console.log("\n⚠️  WARNING: Checksum headers detected in URL - This causes 403 Forbidden with R2 if not handled by client!");
    } else {
        console.log("\n✅ No checksum headers detected. URL looks clean.");
    }
} catch (error) {
    console.error("Error generating signed URL:", error);
}
