import "dotenv/config";
import fs from "fs";
import path from "path";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";
import { createMint } from "@solana/spl-token";

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const keypair = getKeypairFromEnvironment("SECRET_KEY");

    const mint = await createMint(connection, keypair, keypair.publicKey, null, 9);

    const mintAddress = mint.toBase58();
    console.log("✅ Mint created:", getExplorerLink("address", mintAddress, "devnet"));

    const envPath = path.resolve(__dirname, ".tokenEnv");
    fs.writeFileSync(envPath, `MINT_ADDRESS=${mintAddress}\n`);

    console.log(`📦 Mint address saved to .tokenEnv as MINT_ADDRESS`);
})();
