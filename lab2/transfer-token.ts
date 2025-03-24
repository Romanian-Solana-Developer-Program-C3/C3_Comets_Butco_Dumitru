import "dotenv/config";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { getKeypairFromEnvironment, getExplorerLink } from "@solana-developers/helpers";
import { getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, transferChecked } from "@solana/spl-token";
import * as dotenv from "dotenv";
dotenv.config({ path: ".tokenEnv" });


const MINT = new PublicKey(process.env.MINT_ADDRESS!);
const SRC = new PublicKey(process.env.PUBLIC_KEY!);
const DST = new PublicKey(process.env.PUBLIC_KEY!);

(async () => {
    const connection = new Connection(clusterApiUrl("devnet"));
    const keypair = getKeypairFromEnvironment("SECRET_KEY");

    const srcAta = getAssociatedTokenAddressSync(MINT, SRC);
    const dstAta = await getOrCreateAssociatedTokenAccount(connection, keypair, MINT, DST);

    const sig = await transferChecked(
        connection,
        keypair,
        srcAta,
        MINT,
        dstAta.address,
        keypair,
        1, // amount
        9  // decimals
    );

    console.log("✅ Transfer completed:", getExplorerLink("tx", sig, "devnet"));
})();
