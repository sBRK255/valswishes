import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload, FaSpinner, FaHeart, FaImage } from 'react-icons/fa';

export default function CardGenerator({ wish }) {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);

  const downloadCard = async (format = 'png') => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const card = cardRef.current;
      if (!card) throw new Error('Card element not found');

      // Add a temporary background for capture
      card.style.background = 'white';
      
      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#fff',
        width: card.offsetWidth,
        height: card.offsetHeight,
        onclone: (clonedDoc) => {
          const clonedCard = clonedDoc.querySelector('.card-preview');
          if (clonedCard) {
            clonedCard.style.transform = 'none';
            clonedCard.style.boxShadow = 'none';
          }
        }
      });
      
      // Restore original background
      card.style.background = '';
      
      const image = canvas.toDataURL(`image/${format}`, format === 'jpeg' ? 0.9 : undefined);
      const link = document.createElement('a');
      link.download = `valentine-wish-${new Date().getTime()}.${format}`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Sorry, there was an error generating your card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="card-generator">
      <div className="card-preview" ref={cardRef}>
        <div className="card-content">
          <h1 className="card-heading">Dear {wish.toName},</h1>
          <div className="card-message">{wish.message}</div>
          <div className="card-signature">
            With love,<br />
            {wish.fromName} <FaHeart className="inline-block text-pink-500" />
          </div>
          <div className="card-watermark">Created by SirTheProgrammer</div>
        </div>
      </div>
      
      <div className="download-section">
        <button 
          onClick={() => setShowDownloadOptions(!showDownloadOptions)}
          className="download-toggle-button"
        >
          <FaImage className="mr-2" />
          {showDownloadOptions ? 'Hide Download Options' : 'Download This Card'}
        </button>

        {showDownloadOptions && (
          <div className="download-buttons">
            {isGenerating ? (
              <div className="generating-message">
                <FaSpinner className="animate-spin mr-2" />
                Generating your card...
              </div>
            ) : (
              <>
                <button 
                  onClick={() => downloadCard('png')} 
                  className="download-button"
                  disabled={isGenerating}
                >
                  <FaDownload className="mr-2" /> Download as PNG
                </button>
                <button 
                  onClick={() => downloadCard('jpeg')} 
                  className="download-button"
                  disabled={isGenerating}
                >
                  <FaDownload className="mr-2" /> Download as JPEG
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 