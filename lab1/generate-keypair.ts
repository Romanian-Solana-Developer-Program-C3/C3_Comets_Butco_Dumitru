import { Keypair } from "@solana/web3.js";
import * as fs from "fs";
import * as path from "path";

const keypair = Keypair.generate();
const secretKey = Array.from(keypair.secretKey);
const publicKey = keypair.publicKey.toString();

console.log("Keypair generated successfully");
console.log("Public key: " + publicKey);
console.log("Secret key: " + JSON.stringify(secretKey));

fs.writeFileSync(path.join(__dirname, "keypair.json"), JSON.stringify(secretKey, null, 2));
console.log("✅ keypair.json saved");

const env = `SECRET_KEY=${JSON.stringify(secretKey)}\nPUBLIC_KEY=${publicKey}\n`;
fs.writeFileSync(path.join(__dirname, ".env"), env);
console.log("✅ .env file created");
