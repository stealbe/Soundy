const ytdlp = require("yt-dlp-exec");

/**
 * SEARCH TRACKS
 */
async function searchYTTracks(query, limit = 5) {
    if (!query) return [];

    try {
        const result = await ytdlp(`ytsearch${limit}:${query}`, {
            dumpSingleJson: true,
            skipDownload: true,
            quiet: true,
        });

        const entries = result.entries || [];

        return entries
            .filter(v => v && v.id)
            .map(v => ({
                id: v.id,
                title: v.title,
                duration: v.duration,
                author: v.uploader || "Unknown",
                url: `https://www.youtube.com/watch?v=${v.id}`
            }));

    } catch (err) {
        console.error("SEARCH ERROR:", err.message);
        return [];
    }
}


/**
 * GET AUDIO STREAM URL
 */
async function getYTStream(videoId) {
    if (!videoId) return null;

    try {
        const url = `https://www.youtube.com/watch?v=${videoId}`;

        const result = await ytdlp(url, {
            format: "bestaudio/best",
            getUrl: true,
            quiet: true,
        });

        // yt-dlp возвращает чистый URL строкой
        return {
            url: result.trim(),
        };

    } catch (err) {
        console.error("STREAM ERROR:", err.message);
        return null;
    }
}

module.exports = {
    searchYTTracks,
    getYTStream
};