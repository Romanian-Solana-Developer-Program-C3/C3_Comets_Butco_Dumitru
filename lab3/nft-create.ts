import "dotenv/config";

import {
  createGenericFile,
  createSignerFromKeypair,
  generateSigner,
  percentAmount,
  signerIdentity,
  base58,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";
import { readFile } from "fs/promises";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import {
  createNft,
  mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";

const kp = getKeypairFromEnvironment("SECRET_KEY");

const umi = createUmi(clusterApiUrl("devnet"));

let keypair = umi.eddsa.createKeypairFromSecretKey(kp.secretKey);
const signer = createSignerFromKeypair(umi, keypair);
umi.use(mplTokenMetadata());
umi.use(signerIdentity(signer));

const METADATA_URI =
  "https://gateway.irys.xyz/D9j2tYk8jfuCVhgLSQZck51xb7XVFz2t7W6HKSGrfRJW";

async function createMyNFT() {
  try {
    const mint = generateSigner(umi);
    let tx = createNft(umi, {
      name: "Monkey Warrior",
      mint,
      authority: signer,
      sellerFeeBasisPoints: percentAmount(10),
      isCollection: false,
      uri: METADATA_URI,
    });

    let result = await tx.sendAndConfirm(umi);
    const signature = base58.deserialize(result.signature);

    console.log("Succes! ", signature);
  } catch (err) {
    console.error("Error: ", err);
  }
}

createMyNFT();