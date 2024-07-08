import { NextApiRequest, NextApiResponse } from "next";
import pinataSDK from "@pinata/sdk";
import fs from "fs";


export const runtime = "edge";

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataSecretApiKey = process.env.PINATA_API_SECRET;

interface PinataRequest extends NextApiRequest {
  body: {
    did: string;
  };
}

export async function GET(req: PinataRequest, res: NextApiResponse) {
  try {
    // const pinata = new pinataSDK({ pinataApiKey, pinataSecretApiKey });
    // const options = {
    //   pinataMetadata: {
    //     did: req.body.did,
    //   },
    // };
    // const pinataResponse = await pinata.pinFileToIPFS(req.body.file, options);
    // return res.json(pinataResponse);
    console.log('hello')
    return new Response(`Hello`, {status: 200}); 

    
  } catch (error) {
    return new Response(`Failed to generate image`, {
      status: 500,
    });
  }
}
