function auth(apiKey) {
    if (apiKey === process.env.APIKEY) {
        return true;
    } else {
        return false;
    }
}

module.exports = { auth };