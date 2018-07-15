export class Config {
    public algoliaApiKey = process.env.algoliaApiKey || '';
    public algoliaAppId = process.env.algoliaAppId || '';
    public baseUrl = process.env.NODE_ENV === 'production' ? 'https://nucard-netrunner.herokuapp.com' : 'http://localhost:/2577';
    public port = process.env.PORT || 2577;
}
