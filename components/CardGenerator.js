import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload, FaSpinner, FaGift, FaPalette, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export default function CardGenerator({ wish }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadSection, setShowDownloadSection] = useState(false);
  const [theme, setTheme] = useState('classic'); // classic, festive, winter, elegant

  const themes = {
    classic: {
      background: 'linear-gradient(135deg, #f8fffe 0%, #e8f4f8 100%)',
      fontColor: '#2c3e50',
      accentColor: '#c41e3a'
    },
    festive: {
      background: 'linear-gradient(135deg, #165b33 0%, #c41e3a 100%)',
      fontColor: '#ffffff',
      accentColor: '#d4af37'
    },
    winter: {
      background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e9f7 100%)',
      fontColor: '#2c3e50',
      accentColor: '#165b33'
    },
    elegant: {
      background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
      fontColor: '#ecf0f1',
      accentColor: '#d4af37'
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
          Warm wishes,<br/>
          ${wish.fromName} 🎄
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
      link.download = `christmas-wish-${theme}-${new Date().getTime()}.${format}`;
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
    <div className="card-download-container">
      <button
        className="download-toggle-button"
        onClick={() => setShowDownloadSection(!showDownloadSection)}
      >
        <FaDownload className="mr-2" />
        {showDownloadSection ? 'Hide Download Options' : 'Download this card'}
        {showDownloadSection ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
      </button>

      {showDownloadSection && (
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
      )}
    </div>
  );
} 