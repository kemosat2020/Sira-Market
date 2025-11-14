
import React from 'react';

interface BarcodeProps {
  text: string;
}

const Barcode: React.FC<BarcodeProps> = ({ text }) => {
  const barcodeStyles = `
    .barcode-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 10px;
    }
    .barcode-bars {
      display: flex;
      align-items: flex-end;
      height: 50px;
    }
    .barcode-bar {
      width: 2px;
      background-color: #000;
      margin: 0 1px;
    }
    .barcode-text {
      font-family: 'Inconsolata', monospace;
      letter-spacing: 4px;
      font-size: 14px;
      margin-top: 4px;
    }
  `;

  // Simple hashing function to generate somewhat unique bar patterns
  const getBarHeight = (char: string) => {
    return 25 + (char.charCodeAt(0) % 25);
  };

  return (
    <>
      <style>{barcodeStyles}</style>
      <div className="barcode-container">
        <div className="barcode-bars">
          {text.split('').map((char, index) => (
            <div 
              key={index} 
              className="barcode-bar" 
              style={{ height: `${getBarHeight(char)}px` }}
            />
          ))}
        </div>
        <div className="barcode-text">{text}</div>
      </div>
    </>
  );
};

export default Barcode;
