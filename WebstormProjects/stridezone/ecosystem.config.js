module.exports = {
    apps: [{
        name: 'www',
        script: './bin/www',
        watch: true,
        env: {
            NODE_ENV: 'production',
            MONGO_CS: 'mongodb://cgtc:b92485c7-8d93-4a84-a9ed-a28015d4b2bd@162.243.86.154:27017/test'
        },
        env_production: {
            NODE_ENV: 'production',
            MONGO_CS: 'mongodb://cgtc:b92485c7-8d93-4a84-a9ed-a28015d4b2bd@162.243.86.154:27017/test'
        }
    }]
};
