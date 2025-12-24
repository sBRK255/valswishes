import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { FaGift, FaSnowflake } from 'react-icons/fa';
import Footer from '../components/Footer';
import DonorTicker from '../components/DonorTicker';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fromName: '',
    toName: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/saveWish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.id) {
        router.push(`/wish/${data.id}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create wish. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Christmas Wish</title>
        <meta name="description" content="Create and share Christmas wishes with your loved ones" />
      </Head>

      <div className="container">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="form-container"
        >
          <motion.div
            className="floating"
            initial={{ y: 0 }}
            animate={{ y: [-10, 0, -10] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <h1 className="heading" style={{ color: 'white' }}>
              Create Your Christmas Wish <FaSnowflake className="inline-block" style={{ color: '#d4af37' }} />
            </h1>
          </motion.div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Your Name"
                className="input-field"
                value={formData.fromName}
                onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                required
                maxLength={50}
              />
            </div>

            <div className="mb-4">
              <input
                type="text"
                placeholder="Recipient's Name"
                className="input-field"
                value={formData.toName}
                onChange={(e) => setFormData({ ...formData, toName: e.target.value })}
                required
                maxLength={50}
              />
            </div>

            <div className="mb-4">
              <textarea
                placeholder="Write your heartfelt Christmas message..."
                className="input-field"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={5}
                maxLength={500}
              />
            </div>

            <motion.button
              type="submit"
              className="submit-button"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                'Creating your wish...'
              ) : (
                <>
                  Send Christmas Wishes <FaGift className="inline-block ml-2" />
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>

      <DonorTicker />
      <Footer />
    </>
  );
}
