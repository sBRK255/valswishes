import { motion } from 'framer-motion';
import { FaSnowflake } from 'react-icons/fa';
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
          Made with <FaSnowflake className="inline-block animate-pulse" style={{ color: '#d4af37' }} /> by{' '}
          <a
            href="https://codeskytz.site"
            target="_blank"
            rel="noopener noreferrer"
            className="author-link"
          >
            codeskytz
          </a>
        </div>
      </motion.footer>
    </>
  );
} 