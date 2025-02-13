import { useEffect } from 'react';

export default function Advertisement({ slot = "7108422145", format = 'auto' }) {
  useEffect(() => {
    try {
      // Push the ad after component mounts
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

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