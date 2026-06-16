async function searchArchiveMp3(q, candidates) {
    try {
        const [title, ...artistParts] = q.split(' ');
        const artist = artistParts.join(' ');

        const iaQuery = encodeURIComponent(
            `(title:"${q}" OR title:"${title}") AND mediatype:audio`
        );

        const res = await fetch(
            `https://archive.org/advancedsearch.php?q=${iaQuery}&fl[]=identifier,title,creator&rows=5&output=json`
        );

        if (!res.ok) return;

        const json = await res.json();
        const docs = json?.response?.docs || [];

        for (const item of docs) {
            const metaRes = await fetch(`https://archive.org/metadata/${item.identifier}`);
            if (!metaRes.ok) continue;

            const meta = await metaRes.json();
            const mp3 = (meta?.files || []).find(f => f.name?.toLowerCase().endsWith('.mp3'));



            if (mp3) {
                const check = await fetch(`https://archive.org/download/${item.identifier}/${mp3.name}`, { method: 'HEAD' });
                if (check.ok) {
                    candidates.push({
                        source: 'archive',
                        rank: 0.7,
                        external_id: item.identifier,
                        title: item.title || q,
                        artists: [{ name: item.creator || 'Unknown', subscribers: null }],
                        album: null,
                        duration_ms: null,
                        cover_path: null,
                        path: `https://archive.org/download/${item.identifier}/${mp3.name}`
                    });
                }
            }
        }
    } catch (e) {
        console.warn("[Archive.org error]", e.message);
    }
}

module.exports = { searchArchiveMp3 };