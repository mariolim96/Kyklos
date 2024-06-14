const formatTimestamp = (timestamp: number, format?: Intl.DateTimeFormatOptions, locales?: Intl.LocalesArgument) => {
    // Convert timestamp to milliseconds
    const timestampInMilliseconds = timestamp * 1000;

    // Convert timestamp to Date object
    const date = new Date(timestampInMilliseconds);

    // Format the date
    const options: Intl.DateTimeFormatOptions = format ?? {
        day: "numeric",
        month: "short",
        year: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    };
    return date.toLocaleString(locales ?? "en-GB", options);
};
export { formatTimestamp };
