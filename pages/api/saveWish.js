import { db } from '../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { fromName, toName, message } = req.body;
    
    const docRef = await addDoc(collection(db, 'wishes'), {
      fromName,
      toName,
      message,
      createdAt: new Date().toISOString()
    });

    res.status(200).json({ id: docRef.id });
  } catch (error) {
    console.error('Error saving wish:', error);
    res.status(500).json({ message: 'Error saving wish' });
  }
}
