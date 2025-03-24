import "dotenv/config";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";
import { getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import * as dotenv from "dotenv";
dotenv.config({ path: ".tokenEnv" });

const MINT = new PublicKey(process.env.MINT_ADDRESS!);

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const keypair = getKeypairFromEnvironment("SECRET_KEY");

    const ata = await getOrCreateAssociatedTokenAccount(
        connection,
        keypair,
        MINT,
        keypair.publicKey
    );

    const sig = await mintTo(connection, keypair, MINT, ata.address, keypair, 10 * 10 ** 9);

    console.log("✅ Tokens minted:", getExplorerLink("tx", sig, "devnet"));
})();
