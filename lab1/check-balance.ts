import "dotenv/config";
import { getKeypairFromEnvironment, airdropIfRequired } from "@solana-developers/helpers";
import { Connection, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js";

async function checkBalanceAndAirdrop() {
  try {
    const keypair = getKeypairFromEnvironment("SECRET_KEY");
    const pubKey = keypair.publicKey;
    const connection = new Connection(clusterApiUrl("devnet"));

    const balance = await connection.getBalance(pubKey);
    const sol = balance / LAMPORTS_PER_SOL;
    console.log(`Wallet ${pubKey.toBase58()} has ${sol} SOL`);

    if (balance < 5 * LAMPORTS_PER_SOL) {
      console.log("Balance below 5 SOL, requesting airdrop...");

      await airdropIfRequired(connection, pubKey, LAMPORTS_PER_SOL, 5 * LAMPORTS_PER_SOL);

      const newBalance = await connection.getBalance(pubKey);
      console.log(`New balance: ${newBalance / LAMPORTS_PER_SOL} SOL`);
    }
  } catch (err) {
    console.error("Error:", err);
  }
}

checkBalanceAndAirdrop();
