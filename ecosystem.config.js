module.exports = {
    apps: [{
        name: "blockchainOperations",
        script: "./app.js",
        instances: "max",
        env: {
            NODE_ENV: "development",
        },
        env_production: {
            NODE_ENV: "production",
        }
    }]
}