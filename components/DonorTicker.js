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
        }, 4000); // 4 seconds per name

        return () => clearInterval(interval);
    }, [donations.length]);

    if (donations.length === 0) return null;

    const currentDonor = donations[currentIndex];

    return (
        <div className="ticker-container">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentDonor.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="donor-toast"
                >
                    <div className="donor-card">
                        <div className="icon-container">
                            <FaGift className="gift-icon" />
                        </div>
                        <div className="donor-info-text">
                            <p className="donor-name">{currentDonor.name}</p>
                            <p className="donor-message">
                                donated <span className="amount">{currentDonor.amount?.toLocaleString()} TSh</span>
                            </p>
                        </div>
                        <FaHeart className="heart-icon icon-pulse" />
                    </div>
                </motion.div>
            </AnimatePresence>

            <style jsx>{`
        .ticker-container {
          position: fixed;
          bottom: 25px;
          left: 20px;
          z-index: 50;
          pointer-events: none;
        }
        .donor-toast {
          margin-bottom: 1rem;
        }
        .donor-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          padding: 0.8rem 1.2rem;
          border-radius: 50px;
          box-shadow: 0 8px 32px rgba(196, 30, 58, 0.2);
          display: flex;
          align-items: center;
          gap: 1rem;
          border: 2px solid rgba(212, 175, 55, 0.4);
          min-width: 280px;
        }
        .icon-container {
          background: var(--primary-color);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .gift-icon {
          color: #facc15;
          font-size: 1.25rem;
        }
        .heart-icon {
          color: #ef4444;
          margin-left: 0.5rem;
        }
        .icon-pulse {
            animation: heartPulse 1.5s infinite;
        }
        @keyframes heartPulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        .donor-info-text {
          flex: 1;
        }
        .donor-name {
          font-weight: 700;
          color: var(--primary-color);
          font-size: 0.95rem;
          line-height: 1.2;
        }
        .donor-message {
          font-size: 0.8rem;
          color: #666;
          margin: 0;
        }
        .amount {
          color: #165b33;
          font-weight: 700;
        }
       `}</style>
        </div>
    );
}
