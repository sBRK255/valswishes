import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaGift } from 'react-icons/fa';

export default function DonorTicker() {
  const [donations, setDonations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'donations'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const donationList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDonations(donationList);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (donations.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % donations.length);
    }, 3000); // 3 seconds per cycle (2s visible + transition)

    return () => clearInterval(interval);
  }, [donations.length]);

  if (donations.length === 0) return null;

  const currentDonor = donations[currentIndex];

  return (
    <div className="ticker-container">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentDonor.id}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="donor-card"
        >
          <div className="icon-container">
            <FaGift className="gift-icon" />
          </div>
          <div className="donor-info-text">
            <p className="donor-name">{currentDonor.name}</p>
            <p className="donor-message">
              donated <span className="amount">{currentDonor.amount?.toLocaleString()} TSh</span>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      <style jsx>{`
        .ticker-container {
          position: fixed;
          bottom: 120px; /* Moved up to avoid footer/ads */
          left: 20px;
          z-index: 9999; /* Higher z-index to stay on top */
          pointer-events: none;
        }
        .donor-card {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(8px);
          padding: 0.5rem 1rem; /* Smaller padding */
          border-radius: 40px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          gap: 0.8rem;
          border: 1px solid rgba(212, 175, 55, 0.3);
          min-width: 200px; /* Smaller width */
          max-width: 280px;
        }
        .icon-container {
          background: var(--gradient-christmas);
          width: 32px; /* Smaller icon */
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .gift-icon {
          color: white;
          font-size: 0.9rem;
        }
        .donor-info-text {
          flex: 1;
        }
        .donor-name {
          font-weight: 700;
          color: var(--primary-color);
          font-size: 0.85rem; /* Smaller font */
          line-height: 1.1;
        }
        .donor-message {
          font-size: 0.7rem; /* Smaller font */
          color: #666;
          margin: 0;
        }
        .amount {
          color: var(--secondary-color);
          font-weight: 700;
        }
       `}</style>
    </div>
  );
}
