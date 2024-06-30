'use client'
import { GameState } from '@/contexts/game-context';
import React, { useEffect, useRef, useState } from 'react';

interface IndicatorProps {
  multiplier: number;
hide:boolean
}
interface Position {
    x: number;
    y: number;
  }
const IndicatorChart: React.FC<IndicatorProps> = ({ multiplier ,hide}) => {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const [path, setPath] = useState<Position[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current && multiplier >= 0 && multiplier <= 5) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;

        const x = ((multiplier - 1) / 4) * containerWidth;
        const y = Math.exp(multiplier - 1) * (containerHeight / Math.exp(4));

        setPosition({ x, y });
        setPath((prevPath) => [...prevPath, { x, y:y-75 }]);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [multiplier]);

  useEffect(()=>{
    if(hide)
    setPath([]);
  },[hide])
  return (


    <div className='z20' ref={containerRef} style={{ position: 'absolute', width: '95%', height: '300px', bottom:1}}>
          <svg className='z-20' style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
        <polyline
          fill="none"
          stroke="#D2691E"
          strokeWidth="3"
          points={path.map((p) => `${p.x},${200 - p.y}`).join(' ')}
        />
      </svg>
      <div
      className='bg-orange-700 blur-[1px] z-20'
        style={{
          position: 'absolute',
          left: `${position.x}px`,
          top: `${255 - position.y}px`,
          transform: 'translate(-50%,50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          
        }}
      ></div>
      <div className='border-t pt-3 border-gray-600 ' style={{ position: 'absolute', bottom: 1, left: 0, right: 0, display: 'flex', justifyContent: 'space-between' }}>
        {[1, 2, 3, 4, 5].map((num) => (
          <span className='text-xs' key={num}>{num}</span>
        ))}
      </div>
    </div>
  );
};

export default IndicatorChart;