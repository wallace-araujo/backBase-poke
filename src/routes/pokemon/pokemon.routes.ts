import { ServerRoute } from '@hapi/hapi';
import Joi from 'joi';
import {
    createPokemon,
    updatePokemon,
    deletePokemon,
    getPokemon,
    getAllPokemons
} from './pokemon.controller';

const routes: ServerRoute[] = [
    {
        method: 'POST',
        path: '/',
        handler: createPokemon,
        options: {
            description: 'Create a new Pokémon',
            tags: ['api', 'pokemons'],
            validate: {
                payload: Joi.object({
                    tipo: Joi.string().valid('charizard', 'mewtwo', 'pikachu').required(),
                    treinador: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'PUT',
        path: '/{id}',
        handler: updatePokemon,
        options: {
            description: 'Update Pokémon trainer',
            tags: ['api', 'pokemons'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().positive().required()
                }),
                payload: Joi.object({
                    treinador: Joi.string().required()
                })
            }
        }
    },
    {
        method: 'DELETE',
        path: '/{id}',
        handler: deletePokemon,
        options: {
            description: 'Delete a Pokémon',
            tags: ['api', 'pokemons'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().positive().required()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/{id}',
        handler: getPokemon,
        options: {
            description: 'Get Pokémon details',
            tags: ['api', 'pokemons'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().positive().required()
                })
            }
        }
    },
    {
        method: 'GET',
        path: '/',
        handler: getAllPokemons,
        options: {
            description: 'Get all Pokémons',
            tags: ['api', 'pokemons']
        }
    }
];

export default routes;