import type { NextApiRequest, NextApiResponse } from "next";
import Clarifai from 'clarifai';

//initialing the clarifai with the api ikey
const clarifai = new Clarifai.App({
    apiKey: process.env.CLARIFAI_API_KEY,
});

//defining the response type
type Data = {
    message: string;
};

// defining the api route function
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    if (req.method === 'POST') {
        //getting image from the request body
        const { image } = req.body;
        if (!image) return res.status(400).json({ message: 'No Image Found.' });

        try {
            const response = await clarifai.models.predict(Clarifai.GENERAL_MODEL, image);
            const concepts = response.output[0].data.concepts;
            const descriptions = concepts.map((concept: any) => concept.name).join(', ');

            //return the description of objects found in image
            res.status(200).json({ message: `The image contains: ${descriptions}` });
        } catch (error) {
            res.status(500).json({ message: 'Error in analyzing the image.' })
        }


    } else {
        //ONly post requests allowed
        res.status(405).json({ message: "Mehtod Not Allowed." });
    }
}

