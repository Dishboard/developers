export const getRelativeTimeWithSeconds = (updatedAt: string) => {
    const now = new Date();
    const updatedDate = new Date(updatedAt);
    const timeDiffInMs = now.getTime() - updatedDate.getTime(); // Difference in milliseconds

    const secondsAgo = Math.floor(timeDiffInMs / 1000);
    const minutesAgo = Math.floor(secondsAgo / 60);
    const hoursAgo = Math.floor(minutesAgo / 60);
    const daysAgo = Math.floor(hoursAgo / 24);

    if (daysAgo > 0) {
        return `${daysAgo} days, ${hoursAgo % 24} hours, ${minutesAgo % 60} minutes, and ${
            secondsAgo % 60
        } seconds ago`;
    }
    if (hoursAgo > 0) {
        return `${hoursAgo} hours, ${minutesAgo % 60} minutes, and ${secondsAgo % 60} seconds ago`;
    }
    if (minutesAgo > 0) {
        return `${minutesAgo} minutes and ${secondsAgo % 60} seconds ago`;
    }
    return `${secondsAgo} seconds ago`;
};

export const isDataStale = (updatedAt: string): boolean => {
    const now = new Date();
    const updatedDate = new Date(updatedAt);
    const FIVE_MINUTES = 5 * 60 * 1000;
    return now.getTime() - updatedDate.getTime() > FIVE_MINUTES;
};
