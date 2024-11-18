export const calculateDifference = (start: Date, end: Date) => {
    const diffInMs = end.getTime() - start.getTime();
    const totalSeconds = Math.floor(diffInMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return { minutes, seconds };
};
