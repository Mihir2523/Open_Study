import admin from 'firebase-admin';
import express from 'express';

const authenticateToken = async (req, res, next) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).send('Unauthorized: No token provided');
    }
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).send('Unauthorized: Token expired. Please log in again.');
        }
        return res.status(401).send('Unauthorized: Invalid token');
    }
};

const app = express();

app.get('/protected-quiz-data', authenticateToken, (req, res) => {
    console.log('User UID:', req.user.uid);
    console.log('User Email:', req.user.email);
    res.send(`Welcome, ${req.user.email}! Here's your protected quiz data.`);
});

app.listen(3000, () => console.log('Server running on port 3000'));

export default app;