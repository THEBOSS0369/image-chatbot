'use client'
import React from "react";
import { useState } from "react";
import axios from 'axios';

// defining chatbot component as the react function
const Chatbot: React.FC = () => {
    // usestate to hold image and the response
    const [image, setImage] = useState<string | null>(null);
    const [response, setResponse] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    // handle when user uploads an image
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] // getting the file from the user
        if (!file) return;

        setLoading(true);
        const reader = new FileReader(); //reading the file
        reader.readAsDataURL(file);
        reader.onloadend = async () => {
            setImage(reader.result as string) //set the image to the file content

            try {
                //sending the image to server to check/analyzed
                const res = await axios.post('../api/analyze-image', { image: reader.result })
                setResponse(res.data.message); // updating the response state with the server's messsage
            } catch (error) {
                console.error(error);
                setResponse('Error analyzing image.');
            } finally {
                setLoading(false);
            }
        };
    };

    return (
        <div className="chatbot-container">
            <h1 className="text-2xl font-bold mb-4">Conversational image recognition chatbot</h1>
            <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mb-4"
            />
            {loading && <p>Analyzing Image...</p>}
            {image && <img src={image} alt="Uploaded" className="mb-4" />}
            <div className="response bg-blue-700 p-4 rounded">
                {response}
            </div>
        </div>
    );
};

export default Chatbot;
