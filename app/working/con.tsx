'use client';
import { useState } from 'react';
import Clarifai from 'clarifai';

// Initialize Clarifai with the API key directly in the code
const app = new Clarifai.App({
    apiKey: 'd9aeb2ea94f241299eb9890d4a933ce0', // Replace with your actual Clarifai API key
});

export default function Home() {
    const [imageUrl, setImageUrl] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [userMessage, setUserMessage] = useState('');
    const [chat, setChat] = useState<{ user: string; bot: string }[]>([]);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                if (reader.result) {
                    setImageUrl(reader.result.toString());
                    try {
                        const response = await app.models.predict(Clarifai.GENERAL_MODEL, { base64: reader.result.toString().split(',')[1] });
                        setResponse(response.outputs[0].data.concepts.map((concept: any) => concept.name).join(', '));
                    } catch (error) {
                        console.error('Error analyzing the image:', error);
                        setResponse('Error analyzing the image.');
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSendMessage = () => {
        const botResponse = `You asked about ${response}.`;
        setChat([...chat, { user: userMessage, bot: botResponse }]);
        setUserMessage('');
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Conversational Image Chatbot</h1>
            <input type="file" onChange={handleImageUpload} style={styles.fileInput} />
            {imageUrl && <img src={imageUrl} alt="Uploaded" style={styles.image} />}
            {response && <p style={styles.response}>Image Analysis Result: {response}</p>}

            <div style={styles.chatContainer}>
                <input
                    type="text"
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Ask a question about the image..."
                    style={styles.input}
                />
                <button onClick={handleSendMessage} style={styles.button}>
                    Send Message
                </button>
            </div>

            <div style={styles.chatBox}>
                <h2 style={styles.chatHeading}>Chat</h2>
                {chat.map((message, index) => (
                    <div key={index} style={styles.message}>
                        <strong style={styles.userLabel}>User:</strong> {message.user}
                        <br />
                        <strong style={styles.botLabel}>Bot:</strong> {message.bot}
                    </div>
                ))}
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#1e1e2f',
        color: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
    },
    heading: {
        textAlign: 'center' as 'center',
        fontSize: '24px',
        marginBottom: '20px',
        color: '#00FF7F',
    },
    fileInput: {
        width: '100%',
        padding: '10px',
        marginBottom: '20px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '4px',
        border: '1px solid #444',
    },
    image: {
        maxWidth: '100%',
        marginTop: '20px',
        borderRadius: '8px',
    },
    response: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#444',
        borderRadius: '8px',
    },
    chatContainer: {
        marginTop: '20px',
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '4px',
        border: '1px solid #444',
    },
    button: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#00FF7F',
        color: '#000',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
    chatBox: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#222',
        borderRadius: '8px',
    },
    chatHeading: {
        fontSize: '18px',
        marginBottom: '10px',
    },
    message: {
        marginBottom: '10px',
        padding: '10px',
        backgroundColor: '#333',
        borderRadius: '8px',
    },
    userLabel: {
        color: '#00FF7F',
    },
    botLabel: {
        color: '#00FFFF',
    },
};

