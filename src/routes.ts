import { RequestHandler } from 'express';
import * as asyncHandler from 'express-async-handler';
import { ApiDataService } from './services/api-data.service';
import { Config } from './config';

export class RouteDefintion {
    constructor(public path: string, public method: string, public handler: RequestHandler) { }
}

export class AppRoutes {
    public static getRoutes(config: Config): RouteDefintion[] {
        return [
            {
                path: '/cards/random',
                method: 'GET',
                handler: asyncHandler(async (request, response) => {
                    const dataService = new ApiDataService(config);
                    const card = await dataService.getRandomCard();

                    response.type('application/json');
                    response.send(card);
                }),
            },
            {
                path: '/cards/search/:query',
                method: 'GET',
                handler: asyncHandler(async (request, response) => {
                    const dataService = new ApiDataService(config);
                    const cards = await dataService.search(request.params.query);

                    response.type('application/json');
                    response.send(cards);
                }),
            },
            {
                path: '/rules-symbols',
                method: 'GET',
                handler: asyncHandler(async (request, response) => {
                    const dataService = new ApiDataService(config);
                    const symbols = await dataService.getRulesSymbols();

                    response.type('application/json');
                    response.send(symbols);
                }),
            },
            {
                path: '/',
                method: 'GET',
                handler: (request, response) => {
                    response.send("Hello, friend. Who's your favorite runner?");
                },
            },
        ];
    }
}
