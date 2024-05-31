export const calculateMinutesDiff = (lastUpdated: string): number => {
    const now = new Date();
    const updatedAt = new Date(lastUpdated);
    const diff = now.getTime() - updatedAt.getTime();
    return Math.floor(diff / (1000 * 60));
};
