import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import Head from 'next/head';
import { db } from '../../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { FaHeart, FaWhatsapp, FaFacebook, FaInstagram, FaPen, FaShare, FaLink } from 'react-icons/fa';
import Footer from '../../components/Footer';
import CardGenerator from '../../components/CardGenerator';

// Heart animation component
const FloatingHeart = ({ style }) => (
  <motion.div
    className="heart-animation"
    initial={{ scale: 0, y: 100 }}
    animate={{
      scale: [1, 1.2, 1],
      y: [-20, -180],
      opacity: [1, 0],
    }}
    transition={{ duration: 2 }}
    style={style}
  >
    <FaHeart className="text-pink-500" />
  </motion.div>
);

export default function WishPage() {
  const router = useRouter();
  const { id } = router.query;
  const [wish, setWish] = useState(null);
  const [hearts, setHearts] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showShareButtons, setShowShareButtons] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchWish = async () => {
        try {
          const wishDoc = await getDoc(doc(db, 'wishes', id));
          if (wishDoc.exists()) {
            setWish(wishDoc.data());
          } else {
            router.push('/404');
          }
        } catch (error) {
          console.error('Error fetching wish:', error);
          router.push('/404');
        }
      };
      fetchWish();
    }
  }, [id, router]);

  useEffect(() => {
    if (wish) {
      const audio = new Audio('/love-song.mp3');
      audio.loop = true;
      audio.volume = 0.3;
      
      // Try to autoplay
      const playMusic = async () => {
        try {
          await audio.play();
          setIsPlaying(true);
        } catch (error) {
          console.log('Autoplay prevented:', error);
          // Fallback to click-to-play
          const handleClick = () => {
            audio.play().then(() => {
              setIsPlaying(true);
              document.removeEventListener('click', handleClick);
            }).catch(console.error);
          };
          document.addEventListener('click', handleClick);
        }
      };

      playMusic();

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [wish]);

  useEffect(() => {
    if (wish) {
      const interval = setInterval(() => {
        const newHeart = {
          id: Date.now(),
          style: {
            left: `${Math.random() * 100}vw`,
          },
        };
        setHearts(prev => [...prev.slice(-15), newHeart]); // Keep only last 15 hearts
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [wish]);

  const shareMessage = encodeURIComponent(
    `💝 ${wish?.toName} has received a special Valentine's wish from ${wish?.fromName}! Click to view this lovely message 💌`
  );

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${shareMessage}%0A%0A${
      typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''
    }`,
    facebook: `https://www.facebook.com/sharer.php?u=${
      typeof window !== 'undefined' ? encodeURIComponent(window.location.href) : ''
    }&quote=${shareMessage}`,
    copy: typeof window !== 'undefined' ? window.location.href : ''
  };

  const handleShare = async (platform) => {
    try {
      if (navigator.share && platform === 'native') {
        await navigator.share({
          title: `Valentine's Wish for ${wish?.toName}`,
          text: `${wish?.toName} has received a special Valentine's wish from ${wish?.fromName}! 💝`,
          url: window.location.href
        });
        return;
      }

      if (platform === 'copy') {
        await navigator.clipboard.writeText(shareLinks.copy);
        alert('Link copied to clipboard!');
        return;
      }

      const url = shareLinks[platform];
      window.open(url, '_blank', 'noopener,noreferrer,width=600,height=600');
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying link
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Error copying:', err);
      }
    }
  };

  // Update ShareButtons component
  const ShareButtons = () => (
    <div className="share-buttons-container">
      {navigator.share && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => handleShare('native')}
          className="share-button native"
          aria-label="Share"
        >
          <FaShare className="text-2xl" />
        </motion.button>
      )}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare('whatsapp')}
        className="share-button whatsapp"
        aria-label="Share on WhatsApp"
      >
        <FaWhatsapp className="text-2xl" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare('facebook')}
        className="share-button facebook"
        aria-label="Share on Facebook"
      >
        <FaFacebook className="text-2xl" />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => handleShare('copy')}
        className="share-button copy"
        aria-label="Copy Link"
      >
        <FaLink className="text-2xl" />
      </motion.button>
    </div>
  );

  if (!wish) {
    return (
      <div className="container">
        <div className="form-container text-center">
          <p className="text-xl">Loading your valentine wish...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Valentine's Wish for {wish.toName}</title>
        <meta name="description" content={`A special Valentine's wish for ${wish.toName}`} />
      </Head>

      <div className="container">
        {hearts.map(heart => (
          <FloatingHeart key={heart.id} style={heart.style} />
        ))}

        {/* Valentine Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="form-container"
        >
          <div className="card-content">
            <motion.h1 
              className="heading"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Dear {wish.toName},
            </motion.h1>

            <motion.div
              className="message-text my-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              {wish.message}
            </motion.div>

            <motion.div
              className="signature mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              With love,<br />
              {wish.fromName} <FaHeart className="inline-block text-pink-500" />
            </motion.div>
          </div>
        </motion.div>

        {/* Add this after the message display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <CardGenerator wish={wish} />
        </motion.div>

        {/* Actions Container (Share and Create) */}
        <motion.div
          className="actions-container"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 2 }}
        >
          {/* Share Section */}
          <motion.div className="share-section">
            <button
              onClick={() => setShowShareButtons(!showShareButtons)}
              className="share-toggle-button"
            >
              {showShareButtons ? 'Hide Share Options' : 'Share This Wish'}
            </button>

            {showShareButtons && (
              <ShareButtons />
            )}
          </motion.div>

          {/* Create Own Section */}
          <div className="create-own-section">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className="create-button"
            >
              <FaPen className="inline-block mr-2" />
              Create Your Own Valentine's Wish
            </motion.button>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
}
