import {
    NcCard,
    NcExternalInfoProvider,
    NcFaction,
    NcRulesSymbol,
} from '@nucard/models/dist';
import { Config } from '../config';
import * as algoliasearch from 'algoliasearch';
import * as firebase from 'firebase-admin';
import * as _ from 'lodash';
import { DocumentReference } from '@google-cloud/firestore';

export class ApiDataService {
    private static INSTANCE: ApiDataService = new ApiDataService();
    public static async create(config: Config): Promise<ApiDataService> {
        this.INSTANCE._config = config;
        await this.INSTANCE.cacheCards();
        return this.INSTANCE;
    }

    private _cardCache: NcCard[] = [];
    private _config: Config;

    private constructor() { }

    private async cacheCards(): Promise<void> {
        if (this._cardCache.length) { return; }

        const cardSnapshots = await this
            .getFirebaseClient()
            .collection('cards')
            .get();

        cardSnapshots.forEach(cardSnapshot => {
            if (cardSnapshot.exists) {
                this._cardCache.push(cardSnapshot.data() as NcCard);
            }
        });
    }

    private getFirebaseClient() {
        if (firebase.apps.length === 0) {
            firebase.initializeApp({
                credential: firebase.credential.cert({
                    projectId: process.env.FIREBASE_PROJECTID,
                    privateKey: process.env.FIREBASE_PRIVATEKEY.replace(/\\n/g, '\n'),
                    clientEmail: process.env.FIREBASE_CLIENTEMAIL,
                }),
            });
        }

        return firebase.firestore();
    }

    public async getCard(cardId: string): Promise<NcCard | null> {
        return this._cardCache.find(c => c.id === cardId);
    }

    public getExternalInfoProviders(card: NcCard): Promise<NcExternalInfoProvider[]> {
        return Promise.resolve([
            {
                name: 'Netrunnerdb',
                icon: 'https://i.imgur.com/CAu1vV3.png',
                url: `https://netrunnerdb.com/en/card/${card.id}`,
            },
            {
                name: 'ANCUR',
                icon: 'https://i.imgur.com/13VFnJE.png',
                url: `https://ancur.wikia.com/wiki/${card.name.replace(/\s+/g, '_')}`,
            },
        ]);
    }

    public getFactions(): Promise<NcFaction[]> {
        return Promise.resolve([
            {
                id: 'anarch',
                name: 'Anarch',
                icon: 'https://i.imgur.com/ogAOqAJ.png',
            },
            {
                id: 'criminal',
                name: 'Criminal',
                icon: 'https://i.imgur.com/9YAKzSP.png',
            },
            {
                id: 'haas-bioroid',
                name: 'Haas-Bioroid',
                icon: 'https://i.imgur.com/XPhsT3b.png',
            },
            {
                id: 'jinteki',
                name: 'Jinteki',
                icon: 'https://i.imgur.com/QXFIkYk.png',
            },
            {
                id: 'nbn',
                name: 'NBN',
                icon: 'https://i.imgur.com/S2gxhVa.png',
            },
            {
                id: 'shaper',
                name: 'Shaper',
                icon: 'https://i.imgur.com/cxfimKF.png',
            },
            {
                id: 'weyland-consortium',
                name: 'Weyland Consortium',
                icon: 'https://i.imgur.com/Di4jzVK.png',
            },
        ]);
    }

    public getRulesSymbols(): Promise<NcRulesSymbol[]> {
        return Promise.resolve([
            { symbol: '[anarch]', image: 'https://i.imgur.com/ogAOqAJ.png' },
            { symbol: '[click]', image: `https://i.imgur.com/t11sIM2.png` },
            { symbol: '[credit]', image: `https://imgur.com/GX1lpdu.png` },
            { symbol: '[criminal]', image: 'https://i.imgur.com/9YAKzSP.png' },
            { symbol: '[haas-bioroid]', image: 'https://i.imgur.com/XPhsT3b.png' },
            { symbol: '[jinteki]', image: 'https://i.imgur.com/QXFIkYk.png' },
            { symbol: '[link]', image: 'https://i.imgur.com/1HN1cR8.png' },
            { symbol: '[nbn]', image: 'https://i.imgur.com/S2gxhVa.png' },
            { symbol: '[recurring-credit]', image: `https://imgur.com/o0Su9z7.png` },
            { symbol: '[shaper]', image: `https://imgur.com/cxfimKF.png` },
            { symbol: '[subroutine]', image: `https://imgur.com/i3MgSWH.png` },
            { symbol: '[trash]', image: `https://i.imgur.com/9sQdhQg.png` },
            { symbol: '[weyland-consortium]', image: `https://i.imgur.com/Di4jzVK.png` },
        ]);
    }

    public async search(query: string): Promise<NcCard[]> {
        return new Promise<NcCard[]>((resolve, reject) => {
            const results = [];
            const algoliaClient = algoliasearch(this._config.algoliaAppId, this._config.algoliaApiKey);
            const index = algoliaClient.initIndex('cards');

            index.search({ query, hitsPerPage: 10 }, async (err: any, content: any) => {
                if (err) {
                    throw err;
                }

                // algolia gives us matching cards with content.hits - we need to merge the ids returned from algolia
                // with data from our firebase database
                const docRefs: DocumentReference[] = [];
                for (const result of content.hits) {
                    docRefs.push(this.getFirebaseClient().doc(`cards/${result.objectID}`));
                }

                const docs = await this.getFirebaseClient().getAll(...docRefs);
                resolve(docs.map(d => d.data() as NcCard));
            });
        });
    }

    public async getRandomCard(): Promise<NcCard> {
        return this._cardCache[_.random(this._cardCache.length - 1)];
    }
}
