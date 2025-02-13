import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload, FaSpinner, FaHeart, FaPalette } from 'react-icons/fa';

export default function CardGenerator({ wish }) {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [theme, setTheme] = useState('classic'); // classic, modern, romantic, minimal

  const themes = {
    classic: {
      background: 'linear-gradient(135deg, #fff5f6 0%, #ffe9ec 100%)',
      fontColor: '#4a4a4a',
      accentColor: '#ff6b6b'
    },
    modern: {
      background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
      fontColor: '#2d3436',
      accentColor: '#6c5ce7'
    },
    romantic: {
      background: 'linear-gradient(135deg, #ffd1ff 0%, #faa7a7 100%)',
      fontColor: '#4a4a4a',
      accentColor: '#e84393'
    },
    minimal: {
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      fontColor: '#2d3436',
      accentColor: '#ff8787'
    }
  };

  const generateCard = async (format = 'png') => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const card = document.createElement('div');
      card.style.width = '800px';
      card.style.padding = '40px';
      card.style.background = themes[theme].background;
      card.style.position = 'fixed';
      card.style.left = '-9999px';
      card.innerHTML = `
        <div style="
          font-family: 'Dancing Script', cursive;
          font-size: 48px;
          color: ${themes[theme].accentColor};
          margin-bottom: 32px;
        ">
          Dear ${wish.toName},
        </div>
        <div style="
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          line-height: 1.8;
          color: ${themes[theme].fontColor};
          margin-bottom: 32px;
          white-space: pre-wrap;
          text-align: justify;
        ">
          ${wish.message}
        </div>
        <div style="
          font-family: 'Dancing Script', cursive;
          font-size: 36px;
          color: ${themes[theme].accentColor};
          text-align: right;
          margin-top: 32px;
        ">
          With love,<br/>
          ${wish.fromName} ❤️
        </div>
        <div style="
          position: absolute;
          bottom: 8px;
          right: 8px;
          font-family: Arial, sans-serif;
          font-size: 10px;
          color: rgba(74, 74, 74, 0.2);
        ">
          Created by SirTheProgrammer
        </div>
      `;

      document.body.appendChild(card);

      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false
      });

      document.body.removeChild(card);

      const image = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : undefined);
      const link = document.createElement('a');
      link.download = `valentine-wish-${theme}-${new Date().getTime()}.${format}`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Error generating card:', error);
      alert('Sorry, there was an error generating your card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="download-section">
      <div className="theme-selector">
        <label className="theme-label">
          <FaPalette className="mr-2" /> Select Theme:
        </label>
        <div className="theme-buttons">
          {Object.keys(themes).map((themeName) => (
            <button
              key={themeName}
              onClick={() => setTheme(themeName)}
              className={`theme-button ${theme === themeName ? 'active' : ''}`}
            >
              {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="download-buttons">
        {isGenerating ? (
          <div className="generating-message">
            <FaSpinner className="animate-spin mr-2" />
            Creating your beautiful card...
          </div>
        ) : (
          <>
            <button 
              onClick={() => generateCard('png')} 
              className="download-button"
              disabled={isGenerating}
            >
              <FaDownload className="mr-2" /> Download as PNG
            </button>
            <button 
              onClick={() => generateCard('jpeg')} 
              className="download-button"
              disabled={isGenerating}
            >
              <FaDownload className="mr-2" /> Download as JPEG
            </button>
          </>
        )}
      </div>
    </div>
  );
} 