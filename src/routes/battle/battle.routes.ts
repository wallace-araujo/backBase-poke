import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import {
    battlePokemons
} from './battle.controller';

const routes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/{pokemonAId}/{pokemonBId}',
        handler: battlePokemons,
        options: {
            description: 'Battle between two pokémons',
            tags: ['api', 'battle'],
            validate: {
                params: Joi.object({
                    pokemonAId: Joi.number().integer().positive().required(),
                    pokemonBId: Joi.number().integer().positive().required()
                })
            }
        }
    }
];

export default routes;