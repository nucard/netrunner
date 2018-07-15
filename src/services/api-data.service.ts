import { NcCard, NcRulesSymbol } from '@nucard/models';
import { Config } from '../config';
import * as algoliasearch from 'algoliasearch';

export class ApiDataService {
    public getRulesSymbols(): Promise<NcRulesSymbol[]> {
        return Promise.resolve([
            // WUBRG
            { symbol: 'B', image: 'https://i.imgur.com/ZLyxX8l.png' },
            { symbol: 'G', image: 'https://i.imgur.com/YjaF6Wa.png' },
            { symbol: 'R', image: 'https://i.imgur.com/p4XdKcn.png' },
            { symbol: 'U', image: 'https://i.imgur.com/QrGKXbz.png' },
            { symbol: 'W', image: 'https://i.imgur.com/xLyb6ri.png' },

            // standard colorless
            { symbol: 'X', image: 'https://i.imgur.com/miX52O2.png' },
            { symbol: '0', image: 'https://i.imgur.com/dP4YVcM.png' },
            { symbol: '1', image: 'https://i.imgur.com/NBSZQvc.png' },
            { symbol: '2', image: 'https://i.imgur.com/NikGSf4.png' },
            { symbol: '3', image: 'https://i.imgur.com/BcCNKh2.png' },
            { symbol: '4', image: 'https://i.imgur.com/Lf4Yw2R.png' },
            { symbol: '5', image: 'https://i.imgur.com/IdCW3mw.png' },
            { symbol: '6', image: 'https://i.imgur.com/CboHEy9.png' },
            { symbol: '7', image: 'https://i.imgur.com/iaDfg6l.png' },
            { symbol: '8', image: 'https://i.imgur.com/NFHlZYf.png' },
            { symbol: '9', image: 'https://i.imgur.com/AXpi79V.png' },
            { symbol: '10', image: 'https://i.imgur.com/r6QyX1Z.png' },
            { symbol: '11', image: 'https://i.imgur.com/WRYqtpY.png' },
            { symbol: '12', image: 'https://i.imgur.com/ShGQRY7.png' },
            { symbol: '13', image: 'https://i.imgur.com/iqYxekV.png' },
            { symbol: '14', image: 'https://i.imgur.com/LxdzU96.png' },
            { symbol: '15', image: 'https://i.imgur.com/mAeNN3U.png' },
            { symbol: '16', image: 'https://i.imgur.com/yESzeJj.png' },
            { symbol: '17', image: 'https://i.imgur.com/QL5o5jP.png' },
            { symbol: '18', image: 'https://i.imgur.com/gdjUxIy.png' },
            { symbol: '19', image: 'https://i.imgur.com/AdtfgNv.png' },
            { symbol: '20', image: 'https://i.imgur.com/0tvdPHz.png' },

            // hybrid
            { symbol: 'BG', image: 'https://i.imgur.com/f19lK3T.png' },
            { symbol: 'BR', image: 'https://i.imgur.com/wQZIftM.png' },
            { symbol: 'GU', image: 'https://i.imgur.com/4DfnU81.png' },
            { symbol: 'GW', image: 'https://i.imgur.com/kAH6n27.png' },
            { symbol: 'RG', image: 'https://i.imgur.com/u3tGGtW.png' },
            { symbol: 'RW', image: 'https://i.imgur.com/FIXJpYn.png' },
            { symbol: 'UB', image: 'https://i.imgur.com/V109WNm.png' },
            { symbol: 'UR', image: 'https://i.imgur.com/dUtlszp.png' },
            { symbol: 'WB', image: 'https://i.imgur.com/REWR9cC.png' },
            { symbol: 'WU', image: 'https://i.imgur.com/8yYGh0G.png' },

            // 2 or
            { symbol: '2B', image: 'https://i.imgur.com/CuBDEVa.png' },
            { symbol: '2G', image: 'https://i.imgur.com/wknxGc8.png' },
            { symbol: '2R', image: 'https://i.imgur.com/XFf1G87.png' },
            { symbol: '2U', image: 'https://i.imgur.com/rnQVZt5.png' },
            { symbol: '2W', image: 'https://i.imgur.com/PZ0DZb7.png' },

            // phyrexian
            { symbol: 'PB', image: 'https://i.imgur.com/8D01Kvj.png' },
            { symbol: 'PG', image: 'https://i.imgur.com/z5nE2HR.png' },
            { symbol: 'PR', image: 'https://i.imgur.com/d3Zuvus.png' },
            { symbol: 'PU', image: 'https://i.imgur.com/l0B5MUZ.png' },
            { symbol: 'PW', image: 'https://i.imgur.com/TR8vAMM.png' },

            // random bullshit
            { symbol: '100', image: 'https://i.imgur.com/5H3qKK1.png' },
            { symbol: '1000000', image: 'https://i.imgur.com/ym2aLGu.png' },
            { symbol: 'C', image: 'https://i.imgur.com/kCmUg7X.png' },
            { symbol: 'HW', image: 'https://i.imgur.com/PI7opU6.png' },
            { symbol: 'S', image: 'https://i.imgur.com/MgQeHVi.png' },

            // tap/untap
            { symbol: 'T', image: 'https://i.imgur.com/XqjeNsl.png' },
            { symbol: 'U', image: 'https://i.imgur.com/CyLR0vg.png' },
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
            cost: "2{Cr}"
            types: ["Event"],
            faction: "Anarch",
            thumbnail: "https://www.cardgamedb.com/forums/uploads/an/med_ADN22_36.png",
            flavorText: "\"Hello thank you for vidding MegaBuy I'm Carol how can I help you.\"",
            text: `As an additional cost to play this event, spend {Cl}{Cl}{Cl}.

Gain 10{Cr}.`,
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