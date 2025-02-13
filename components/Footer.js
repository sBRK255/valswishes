import { motion } from 'framer-motion';
import { FaHeart } from 'react-icons/fa';
import Advertisement from './Advertisement';

export default function Footer() {
  return (
    <>
      <Advertisement />
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="footer"
      >
        <div className="copyright">
          Made with <FaHeart className="inline-block text-pink-500 animate-pulse" /> by{' '}
          <a
            href="https://github.com/sirtheprogrammer"
            target="_blank"
            rel="noopener noreferrer"
            className="author-link"
          >
            SirTheProgrammer
          </a>
        </div>
      </motion.footer>
    </>
  );
} 