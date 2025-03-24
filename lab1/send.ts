import "dotenv/config";
import {
  Connection,
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

async function sendSol({
  amountSol,
  recipientAddress,
}: {
  amountSol: number;
  recipientAddress: string;
}) {
  try {
    const sender = getKeypairFromEnvironment("SECRET_KEY");
    const recipient = new PublicKey(recipientAddress);
    const connection = new Connection(clusterApiUrl("devnet"));

    const tx = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: sender.publicKey,
        toPubkey: recipient,
        lamports: amountSol * LAMPORTS_PER_SOL,
      })
    );

    console.log("Sending", amountSol, "SOL...");
    const sig = await sendAndConfirmTransaction(connection, tx, [sender]);
    console.log("✅ Transaction confirmed! Signature:", sig);
  } catch (err) {
    console.error("Error sending SOL:", err);
  }
}

sendSol({
  amountSol: 0.01,
  recipientAddress: "DU7tFqxQ5D83dEDReLPPyqfms5KuHVc9G2uQHJ4ow1oB",
});
