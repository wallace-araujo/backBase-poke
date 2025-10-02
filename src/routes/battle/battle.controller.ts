import { Request, ResponseToolkit } from '@hapi/hapi';
import {
    battlePokemonsService
} from '../../services/pokemons.service';



export const battlePokemons = async (req: Request, h: ResponseToolkit) => {
    try {
        const pokemonAId = parseInt(req.params.pokemonAId);
        const pokemonBId = parseInt(req.params.pokemonBId);
        if (pokemonAId === pokemonBId) {
            return h.response({ message: 'Um pokémon não pode batalhar consigo mesmo' }).code(400);
        }

        const battleResult = await battlePokemonsService(pokemonAId, pokemonBId);
        return h.response(battleResult).code(200);
    } catch (error: any) {
        if (error.message === 'Pokémon not found') {
            return h.response({ message: error.message }).code(404);
        }
        return h.response({ message: error.message }).code(400);
    }
};