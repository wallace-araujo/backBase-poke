import { Request, ResponseToolkit } from '@hapi/hapi';
import {
    createPokemonService,
    updatePokemonService,
    deletePokemonService,
    getPokemonService,
    getAllPokemonsService
} from '../../services/pokemons.service';

export const createPokemon = async (req: Request, h: ResponseToolkit) => {
    try {
        const { tipo, treinador } = req.payload as any;
        const pokemon = await createPokemonService(tipo, treinador);
        return h.response(pokemon).code(201);
    } catch (error: any) {
        return h.response({ message: error.message }).code(400);
    }
};

export const updatePokemon = async (req: Request, h: ResponseToolkit) => {
    try {
        const id = parseInt(req.params.id);
        const { treinador } = req.payload as any;
        await updatePokemonService(id, treinador);
        return h.response().code(204);
    } catch (error: any) {
        if (error.message === 'Pokémon not found') {
            return h.response({ message: error.message }).code(404);
        }
        return h.response({ message: error.message }).code(400);
    }
};

export const deletePokemon = async (req: Request, h: ResponseToolkit) => {
    try {
        const id = parseInt(req.params.id);
        await deletePokemonService(id);
        return h.response().code(204);
    } catch (error: any) {
        if (error.message === 'Pokémon not found') {
            return h.response({ message: error.message }).code(404);
        }
        return h.response({ message: error.message }).code(400);
    }
};

export const getPokemon = async (req: Request, h: ResponseToolkit) => {
    try {
        const id = parseInt(req.params.id);
        const pokemon = await getPokemonService(id);
        return h.response(pokemon).code(200);
    } catch (error: any) {
        return h.response({ message: error.message }).code(404);
    }
};

export const getAllPokemons = async (req: Request, h: ResponseToolkit) => {
    try {
        const pokemons = await getAllPokemonsService();
        return h.response(pokemons).code(200);
    } catch (error: any) {
        return h.response({ message: error.message }).code(404);
    }
};