import "dotenv/config";

import {
  createSignerFromKeypair,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { clusterApiUrl } from "@solana/web3.js";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";

const kp = getKeypairFromEnvironment("SECRET_KEY");

const umi = createUmi(clusterApiUrl("devnet"));
const keypair = umi.eddsa.createKeypairFromSecretKey(kp.secretKey);
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

const IMAGE_URI = "https://gateway.irys.xyz/Azhh9PradzKniNFR38zmGVLBvUP2zjejXGSZScLqrpnw";

async function uploadMetadata() {
  try {
    console.log("📦 Generating metadata...");

    const metadata = {
      name: "Monkey Warrior",
      symbol: "MNK",
      description: "A happy warrior monkey.",
      image: IMAGE_URI,
      attributes: [
        { trait_type: "Level", value: "Beginner" },
        { trait_type: "Weapon", value: "None" },
        { trait_type: "Mood", value: "Focused" },
        { trait_type: "Color", value: "Dark Brown" },
      ],
      properties: {
        files: [{ type: "image/png", uri: IMAGE_URI }],
        category: "image",
      },
    };

    const metadataUri = await umi.uploader.uploadJson(metadata);

    console.log("Metadata uploaded!");
    console.log("URI:", metadataUri);
  } catch (err) {
    console.error("Failed to upload metadata:", err);
  }
}

uploadMetadata();
