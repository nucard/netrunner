import { NcCard, NcRulesSymbol } from '@nucard/models/dist';
import { Config } from '../config';
import * as algoliasearch from 'algoliasearch';
import { FirebaseService } from './firebase.service';
import { DocumentReference } from '@google-cloud/firestore';

export class ApiDataService {
    constructor(
        private config: Config,
        private firebaseService: FirebaseService = new FirebaseService()) { }

    public getRulesSymbols(): Promise<NcRulesSymbol[]> {
        return Promise.resolve([
            { symbol: '[click]', image: `${config.baseUrl}/click.svg` },
            { symbol: '[credit]', image: `${config.baseUrl}/credit.svg` },
            { symbol: '[subroutine]', image: `${config.baseUrl}/subroutine.svg` },
            { symbol: '[trash]', image: `${config.baseUrl}/trash.svg` },
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
