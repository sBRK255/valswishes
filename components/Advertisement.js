import { useEffect, useState } from 'react';

export default function Advertisement({ slot = "7108422145", format = 'auto' }) {
  const [adError, setAdError] = useState(false);

  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (err) {
      console.error('AdSense error:', err);
      setAdError(true);
    }
  }, []);

  if (adError) return null;

  return (
    <div className="ad-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4783980080225222"
        data-ad-slot="7108422145"
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
} 