let ytClient;

async function getYT() {
    if (!ytClient) ytClient = await Innertube.create();
    return ytClient;
}

module.exports = { getYT };