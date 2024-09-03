'use client';
import { useState } from 'react';
import Clarifai from 'clarifai';

const app = new Clarifai.App({
    apiKey: '',
});

export default function Home() {
    const [imageUrl, setImageUrl] = useState('');
    const [response, setResponse] = useState<string | null>(null);
    const [userMessage, setUserMessage] = useState('');
    const [chat, setChat] = useState<{ user: string; bot: string }[]>([]);
    const [story, setStory] = useState<string | null>(null);

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                if (reader.result) {
                    setImageUrl(reader.result.toString());
                    try {
                        const response = await app.models.predict(Clarifai.GENERAL_MODEL, { base64: reader.result.toString().split(',')[1] });
                        const concepts = response.outputs[0].data.concepts.map((concept: any) => concept.name);
                        setResponse(generateDetailedDescription(concepts));
                        generateStory(concepts);
                    } catch (error) {
                        console.error('Error analyzing the image:', error);
                        setResponse('Error analyzing the image.');
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const generateDetailedDescription = (concepts: string[]): string => {
        if (concepts.length > 0) {
            return `The image likely contains a scene with ${concepts.slice(0, 2).join(' and ')}. There is a strong presence of ${concepts[0]}, possibly along with ${concepts[1]}. You might also find a ${concepts[2]} nearby, indicating ${concepts[3]} activities.`;
        } else {
            return 'No detailed description available for this image.';
        }
    };

    const generateStory = (concepts: string[]) => {
        const story = `Once upon a time, in a world filled with ${concepts[0]} and ${concepts[1]}, there lived a ${concepts[2]} who always dreamed of ${concepts[3]}. One day, the ${concepts[2]} embarked on a journey to find ${concepts[4]}, hoping to discover the meaning of ${concepts[5]}. Along the way, ${concepts[2]} encountered ${concepts[6]} and learned a valuable lesson about ${concepts[7]}. In the end, ${concepts[2]} realized that the true treasure was the ${concepts[8]} within.`;
        setStory(story);
    };

    const handleSendMessage = () => {
        const botResponse = `You asked about ${response}.`;
        setChat([...chat, { user: userMessage, bot: botResponse }]);
        setUserMessage('');
    };

    return (
        <div style={styles.container}>
            <h1 className='text-2xl font-bold' style={styles.heading}>CONVERSATIONAL IMAGE CHATBOT</h1>
            <input type="file" onChange={handleImageUpload} style={styles.fileInput} />
            {imageUrl && <img src={imageUrl} alt="Uploaded" style={styles.image} />}
            {response && <p style={styles.response}>Image Analysis Done</p>}

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

            {story && (
                <div style={styles.storyBox}>
                    <h2 style={styles.storyHeading}>Anticipated Story</h2>
                    <p style={styles.storyText}>{story}</p>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
        padding: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#1e1e2f',
        color: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)',
        minHeight: '100vh',
    },
    heading: {
        textAlign: 'center' as 'center',
        fontSize: '36px',
        marginBottom: '30px',
        color: '#00FF7F',
    },
    fileInput: {
        width: '100%',
        padding: '12px',
        marginBottom: '30px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '6px',
        border: '1px solid #444',
        fontSize: '18px',
    },
    image: {
        maxWidth: '100%',
        marginTop: '30px',
        borderRadius: '12px',
    },
    response: {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#444',
        borderRadius: '12px',
        fontSize: '18px',
    },
    chatContainer: {
        marginTop: '30px',
    },
    input: {
        width: '100%',
        padding: '12px',
        marginBottom: '15px',
        backgroundColor: '#333',
        color: '#fff',
        borderRadius: '6px',
        border: '1px solid #444',
        fontSize: '18px',
    },
    button: {
        width: '100%',
        padding: '12px',
        backgroundColor: '#00FF7F',
        color: '#000',
        borderRadius: '6px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '18px',
        transition: 'background-color 0.3s ease',
    },
    chatBox: {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#222',
        borderRadius: '12px',
    },
    chatHeading: {
        fontSize: '24px',
        marginBottom: '15px',
    },
    message: {
        marginBottom: '15px',
        padding: '20px',
        backgroundColor: '#333',
        borderRadius: '12px',
        fontSize: '18px',
    },
    userLabel: {
        color: '#00FF7F',
    },
    botLabel: {
        color: '#00FFFF',
    },
    storyBox: {
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#222',
        borderRadius: '12px',
    },
    storyHeading: {
        fontSize: '24px',
        marginBottom: '15px',
        color: '#FFD700',
    },
    storyText: {
        color: '#ffffff',
        fontSize: '18px',
    },
};
