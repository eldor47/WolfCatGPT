// pages/api/data.js
import { Configuration, OpenAIApi } from "openai";

import { NextApiRequest, NextApiResponse } from "next";

const configuration = new Configuration({
  apiKey: process.env.APIKEY,
});

type CatData = {
  id: number;
  name: string;
  attributes: any;
  // Add any other properties you want to include from the Cool Cats NFT API response
};

type ApiResponse = {
  cat: CatData | null;
  error?: string;
};

async function getCat(id: string) {
    let response = await fetch("https://api.coolcatsnft.com/cat/" + id)
    const data: CatData = await response.json();
    let attributes = data.attributes
    attributes.pop()
    let msg = ``
    attributes.map((a: { trait_type: string; value: string; }) => {
        msg += "It's " + a.trait_type + " is " + a.value + ", "
    })
    console.log(msg)
    return msg
}

async function getWolf(id: string) {
    let response = await fetch("https://s3.amazonaws.com/metadata.coolcatsnft.com/library/wolf/metadata/" + id)
    const data: CatData = await response.json();
    let attributes = data.attributes
    attributes.pop()
    let msg = ``
    attributes.map((a: { trait_type: string; value: string; }) => {
        msg += "It's " + a.trait_type + " is " + a.value + ", "
    })
    console.log(msg)
    return msg
}

async function callGPT(id1: string, id2: string) {
    const openai = new OpenAIApi(configuration);
    let catMsg = await getCat(id1)
    let wolfMsg = await getWolf(id2)
    let prompt = "Write a 175 word story about a shadow wolf that can teleport through portals vs a cool cat that has these attributes \n "
     + catMsg + " The wolf has these attributes \n" + wolfMsg
    const options = {
        temperature: 0.8,
        max_tokens: 300,
        n: 1,
    };
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      ...options
    });

    if(response.data.choices[0]) {
      return response.data.choices[0].text
    } else {
      return "Error generating story... :("
    }
}

interface MessageResponse {
  message: string;
}

interface RequestBody {
  id1: string;
  id2: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<MessageResponse>) {
  if (req.method === 'POST') {
    const { id1, id2 } = req.body as RequestBody;
    let message = await callGPT(id1, id2);
    const data: MessageResponse = { message: message ? message : ""};
    res.status(200).json(data);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}