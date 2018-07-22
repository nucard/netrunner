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
                path: '/cards/:cardId(\\d+)',
                method: 'GET',
                handler: asyncHandler(async (request, response) => {
                    const dataService = await ApiDataService.create(config);
                    const card = await dataService.getCard(request.params.cardId);

                    if (!card) {
                        response.sendStatus(404);
                        response.send(`Card ${request.params.cardId} doesn't exist.`);
                    } else {
                        response.type('application/json');
                        response.send(card);
                    }
                }),
            },
            {
                path: '/cards/random',
                method: 'GET',
                handler: asyncHandler(async (request, response) => {
                    const dataService = await ApiDataService.create(config);
                    const card = await dataService.getRandomCard();

                    response.type('application/json');
                    response.send(card);
                }),
            },
            {
                path: '/cards/search/:query',
                method: 'GET',
                handler: asyncHandler(async (request, response) => {
                    const dataService = await ApiDataService.create(config);
                    const cards = await dataService.search(request.params.query);

                    response.type('application/json');
                    response.send(cards);
                }),
            },
            {
                path: '/external-info-providers/:cardId',
                method: 'GET',
                handler: asyncHandler(async (request, response) => {
                    const dataService = await ApiDataService.create(config);
                    const card = await dataService.getCard(request.params.cardId);
                    const providers = await dataService.getExternalInfoProviders(card);

                    response.type('application/json');
                    response.send(providers);
                }),
            },
            {
                path: '/factions',
                method: 'GET',
                handler: asyncHandler(async (request, response) => {
                    const dataService = await ApiDataService.create(config);
                    const factions = await dataService.getFactions();

                    response.type('application/json');
                    response.send(factions);
                }),
            },
            {
                path: '/rules-symbols',
                method: 'GET',
                handler: asyncHandler(async (request, response) => {
                    const dataService = await ApiDataService.create(config);
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
