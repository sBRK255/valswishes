import { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload, FaSpinner } from 'react-icons/fa';

export default function CardGenerator({ wish }) {
  const cardRef = useRef(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const downloadCard = async (format = 'png') => {
    if (isGenerating) return;
    
    setIsGenerating(true);
    try {
      const card = cardRef.current;
      if (!card) throw new Error('Card element not found');

      const canvas = await html2canvas(card, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true, // Enable cross-origin image loading
        allowTaint: true
      });
      
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
            {wish.fromName}
          </div>
          <div className="card-watermark">Created by SirTheProgrammer</div>
        </div>
      </div>
      
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
              <FaDownload className="mr-2" /> Download PNG
            </button>
            <button 
              onClick={() => downloadCard('jpeg')} 
              className="download-button"
              disabled={isGenerating}
            >
              <FaDownload className="mr-2" /> Download JPEG
            </button>
          </>
        )}
      </div>
    </div>
  );
} 