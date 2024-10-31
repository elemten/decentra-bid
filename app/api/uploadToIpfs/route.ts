import axios from "axios";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest) {
    const PINATA_API_KEY = process.env.PINATA_IPFS_API_KEY;
const PINATA_SECRET_API_KEY = process.env.PINATA_IPFS_API_SECRET;
const data = await req.json()
const formData = new FormData();
   formData.append('name', data.name);
   formData.append('image', data.image);
    formData.append('description', data.description);
    formData.append('symbol', data.symbol);



console.log('data:', data);
    try {
      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      });
      const ipfsHash = response.data.IpfsHash;
      return NextResponse.json(ipfsHash, { status: 200 })
    } catch (error) {
      console.error('Error uploading image to IPFS:', error);
      throw error;
    }
  };