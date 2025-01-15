import React from 'react';
import '@/styles/Subtitle.css';

interface SubtitleProps {
  text: string;
  color?: string;
}

const Subtitle: React.FC<SubtitleProps> = ({ text, color }) => {
  return (
    <div className="subtitle" style={{ color: color || 'inherit' }}>
      {text}
    </div>
  );
};

export default Subtitle;
