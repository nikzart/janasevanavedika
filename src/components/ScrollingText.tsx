import { useLanguage } from '../hooks/useLanguage';
import type { BilingualText } from '../types';

interface ScrollingTextProps {
  items: BilingualText[];
  speed?: number; // seconds for one complete scroll
  className?: string;
}

export default function ScrollingText({
  items,
  speed = 30,
  className = ''
}: ScrollingTextProps) {
  const { t } = useLanguage();

  // Join all items with a separator
  const text = items.map(item => t(item)).join('  •  ');

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div
        className="inline-block animate-marquee"
        style={{ animationDuration: `${speed}s` }}
      >
        <span>{text}</span>
        <span className="ml-16">{text}</span>
      </div>
    </div>
  );
}
