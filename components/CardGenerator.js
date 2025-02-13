import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { FaDownload } from 'react-icons/fa';

export default function CardGenerator({ wish }) {
  const cardRef = useRef(null);

  const downloadCard = async (format = 'png') => {
    try {
      const card = cardRef.current;
      const canvas = await html2canvas(card, {
        scale: 2, // Higher quality
        backgroundColor: null,
        logging: false
      });
      
      const image = canvas.toDataURL(`image/${format}`);
      const link = document.createElement('a');
      link.download = `valentine-wish.${format}`;
      link.href = image;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
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
        <button 
          onClick={() => downloadCard('png')} 
          className="download-button"
        >
          <FaDownload className="mr-2" /> Download PNG
        </button>
        <button 
          onClick={() => downloadCard('jpeg')} 
          className="download-button"
        >
          <FaDownload className="mr-2" /> Download JPEG
        </button>
      </div>
    </div>
  );
} 