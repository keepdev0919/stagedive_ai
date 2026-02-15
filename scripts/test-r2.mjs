

import { S3Client, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
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

console.log("R2 Configuration Check:");
console.log(`Account ID: ${accountId ? "Set" : "Missing"}`);
console.log(`Access Key ID: ${accessKeyId ? "Set" : "Missing"}`);
console.log(`Secret Access Key: ${secretAccessKey ? "Set" : "Missing"}`);
console.log(`Bucket Name: ${bucketName ? "Set" : "Missing"}`);

if (!accountId || !accessKeyId || !secretAccessKey || !bucketName) {
    console.error("Missing required environment variables.");
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

console.log("\nAttempting to list objects in bucket:", bucketName);

try {
    const command = new ListObjectsV2Command({ Bucket: bucketName, MaxKeys: 5 });
    const response = await client.send(command);
    console.log("Success! R2 Connection Verified.");
    console.log("Objects found:", response.KeyCount || 0);
    if (response.Contents) {
        response.Contents.forEach((c) => console.log(` - ${c.Key}`));
    }

    console.log("\nAttempting to generate Signed URL...");
    const putCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: "test-upload.txt",
        ContentType: "text/plain",
    });
    const signedUrl = await getSignedUrl(client, putCommand, { expiresIn: 3600 });
    console.log("Success! Signed URL generated:");
    console.log(signedUrl);

} catch (error) {
    console.error("Error connecting to R2:", error);
}
