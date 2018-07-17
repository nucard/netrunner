import {
    NcCard,
    NcExternalInfoProvider,
    NcFaction,
    NcRulesSymbol,
} from '@nucard/models/dist';
import { Config } from '../config';
import * as algoliasearch from 'algoliasearch';
import { FirebaseService } from './firebase.service';
import { DocumentReference } from '@google-cloud/firestore';

export class ApiDataService {
    constructor(
        private config: Config,
        private firebaseService: FirebaseService = new FirebaseService()) { }

    public async getCard(cardId: string): Promise<NcCard> {
        const cardSnapshot = await this
            .firebaseService
            .getClient()
            .doc(`cards/${cardId}`)
            .get();

        if (cardSnapshot.exists) {
            return cardSnapshot.data() as NcCard;
        } else {
            return null;
        }
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
            { symbol: '[click]', image: `https://i.imgur.com/t11sIM2.png` },
            { symbol: '[credit]', image: `https://imgur.com/GX1lpdu.png` },
            { symbol: '[link]', image: 'https://i.imgur.com/1HN1cR8.png' },
            { symbol: '[recurring-credit]', image: `https://imgur.com/o0Su9z7.png` },
            { symbol: '[subroutine]', image: `https://imgur.com/i3MgSWH.png` },
            { symbol: '[trash]', image: `https://i.imgur.com/9sQdhQg.png` },
        ]);
    }

    public async search(query: string): Promise<NcCard[]> {
        return new Promise<NcCard[]>((resolve, reject) => {
            const results = [];
            const algoliaClient = algoliasearch(this.config.algoliaAppId, this.config.algoliaApiKey);
            const index = algoliaClient.initIndex('cards');

            index.search({ query, hitsPerPage: 10 }, async (err: any, content: any) => {
                if (err) {
                    throw err;
                }

                // algolia gives us matching cards with content.hits - we need to merge the ids returned from algolia
                // with data from our firebase database
                const docRefs: DocumentReference[] = [];
                for (const result of content.hits) {
                    docRefs.push(this.firebaseService.getClient().doc(`cards/${result.objectID}`));
                }

                const docs = await this.firebaseService.getClient().getAll(...docRefs);
                resolve(docs.map(d => d.data() as NcCard));
            });
        });
    }

    public async getRandomCard(): Promise<NcCard> {
        return Promise.resolve({
            id: "07036",
            name: "Day Job",
            cost: "2[credit]",
            types: ["Event"],
            subtypes: [],
            faction: "Anarch",
            thumbnail: "https://www.cardgamedb.com/forums/uploads/an/med_ADN22_36.png",
            flavorText: "\"Hello thank you for vidding MegaBuy I'm Carol how can I help you.\"",
            text: `As an additional cost to play this event, spend [click][click][click].

Gain 10[credit].`,
            printings: [
                {
                    artist: 'Matt Zeilinger',
                    collectorsNumber: "36",
                    image: 'https://www.cardgamedb.com/forums/uploads/an/med_ADN22_36.png',
                    printingIcon: 'https://raw.githubusercontent.com/MWDelaney/Netrunner-Icon-Font/master/Netrunner/svg/Order-and-Chaos.svg',
                    printedIn: 'Order and Chaos',
                    viewOn: [
                        {
                            name: 'NetrunnerDB',
                            icon: './assets/netrunnerdb.ico',
                            url: 'http://gatherer.wizards.com/Pages/Card/Details.aspx?multiverseid=247236',
                        },
                        {
                            name: 'ANCUR',
                            icon: './assets/ancur.ico',
                            url: 'http://ancur.wikia.com/wiki/Day_Job',
                        },
                    ],
                },
            ],
        });
    }
}
