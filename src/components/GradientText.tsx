import React from 'react';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  showBorder?: boolean;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  colors = ['#40ffaa', '#4079ff', '#40ffaa', '#4079ff', '#40ffaa'],
  animationSpeed = 8,
  showBorder = false,
}) => {
  const gradientColors = colors.join(', ');
  
  const gradientStyle = {
    background: `linear-gradient(90deg, ${gradientColors})`,
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: `gradientMove ${animationSpeed}s ease-in-out infinite`,
  };

  const borderStyle = showBorder ? {
    border: `2px solid transparent`,
    backgroundImage: `linear-gradient(white, white), linear-gradient(90deg, ${gradientColors})`,
    backgroundOrigin: 'border-box',
    backgroundClip: 'padding-box, border-box',
    animation: `gradientMove ${animationSpeed}s ease-in-out infinite`,
  } : {};

  return (
    <>
      <style>
        {`
          @keyframes gradientMove {
            0%, 100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
        `}
      </style>
      <span 
        className={className} 
        style={showBorder ? { ...borderStyle } : { ...gradientStyle }}
      >
        {children}
      </span>
    </>
  );
};

export default GradientText;