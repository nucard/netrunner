import { NcCard, NcRulesSymbol } from '@nucard/models';
import { Config } from '../config';
import * as algoliasearch from 'algoliasearch';

export class ApiDataService {
    constructor(private config: Config) { }

    public getRulesSymbols(): Promise<NcRulesSymbol[]> {
        return Promise.resolve([
            { symbol: '[click]', image: 'https://raw.githubusercontent.com/nucard/netrunner/master/assets/click.svg' },
            { symbol: '[credit]', image: 'https://raw.githubusercontent.com/nucard/netrunner/master/assets/credit.svg' },
            { symbol: '[subroutine]', image: 'https://raw.githubusercontent.com/nucard/netrunner/master/assets/subroutine.svg' },
        ]);
    }

    public async search(query: string): Promise<NcCard[]> {
        return new Promise<NcCard[]>((resolve, reject) => {
            const results = [];
            const algoliaClient = algoliasearch(this.config.algoliaAppId, this.config.algoliaApiKey);
            const index = algoliaClient.initIndex('cards');

            index.search({ query, hitsPerPage: 10 }, (err: any, content: any) => {
                if (err) {
                    throw err;
                }

                resolve(content.hits);
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