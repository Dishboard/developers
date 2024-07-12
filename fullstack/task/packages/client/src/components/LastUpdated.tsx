import { useState, useEffect, FC, Suspense } from 'react';

interface LastUpdatedProps {
  timestamp: string;
}
const LastUpdated: FC<LastUpdatedProps> = ({ timestamp }) => {
  const [timeAgoText, setTimeAgoText] = useState('');

  useEffect(() => {
    const calculateTimeAgo = () => {
      const justNow = 'Just now';
      if (!timestamp) {
        return justNow;
      }
      const now = Date.now();
      const timestampDate = new Date(timestamp);
      const difference = now - new Date(timestampDate).getTime();
      const minutes = Math.floor(difference / 60000);

      if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
      } else {
        return justNow;
      }
    };

    setTimeAgoText(calculateTimeAgo());

    const interval = setInterval(() => {
      setTimeAgoText(calculateTimeAgo());
    }, 60000);

    return () => clearInterval(interval);
  }, [timestamp]);

  return <span className="badge badge-ghost ml-2 my-4">Last updated: {timeAgoText}
  </span>;
};

export default LastUpdated;