import { Server } from '@hapi/hapi';
import { init } from '../../server';
import { query } from '../../config/database';

describe('Pokémons API Integration Tests', () => {
    let server: Server;

    beforeAll(async () => {
        server = await init();
    });

    afterAll(async () => {
        await server.stop();
    });

    beforeEach(async () => {
        await query('DELETE FROM pokemons', []);
        await query('ALTER SEQUENCE pokemons_id_seq RESTART WITH 1', []);
    });

    describe('POST /pokemons', () => {
        it('should create a new pokémon', async () => {
            const payload = {
                tipo: 'pikachu',
                treinador: 'Ash Ketchum'
            };

            const response = await server.inject({
                method: 'POST',
                url: '/pokemons',
                payload
            });

            expect(response.statusCode).toBe(201);
            const result = JSON.parse(response.payload);
            expect(result.id).toBe(1);
            expect(result.tipo).toBe('pikachu');
            expect(result.treinador).toBe('Ash Ketchum');
            expect(result.nivel).toBe(1);
        });

        it('should return 400 for invalid pokémon type', async () => {
            const payload = {
                tipo: 'invalid-type',
                treinador: 'Ash Ketchum'
            };

            const response = await server.inject({
                method: 'POST',
                url: '/pokemons',
                payload
            });

            expect(response.statusCode).toBe(400);
            const result = JSON.parse(response.payload);
            expect(result.message).toContain('Invalid Pokémon type');
        });

        it('should return 400 for missing required fields', async () => {
            const payload = {
                tipo: 'pikachu'
            };

            const response = await server.inject({
                method: 'POST',
                url: '/pokemons',
                payload
            });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET /pokemons/{id}', () => {
        it('should return a pokémon by id', async () => {
            const createResponse = await server.inject({
                method: 'POST',
                url: '/pokemons',
                payload: { tipo: 'charizard', treinador: 'Misty' }
            });
            const createdPokemon = JSON.parse(createResponse.payload);

            const response = await server.inject({
                method: 'GET',
                url: `/pokemons/${createdPokemon.id}`
            });

            expect(response.statusCode).toBe(200);
            const result = JSON.parse(response.payload);
            expect(result.id).toBe(createdPokemon.id);
            expect(result.tipo).toBe('charizard');
            expect(result.treinador).toBe('Misty');
        });

        it('should return 404 for non-existent pokémon', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/pokemons/999'
            });

            expect(response.statusCode).toBe(404);
            const result = JSON.parse(response.payload);
            expect(result.message).toBe('Pokémon not found');
        });
    });

    describe('GET /pokemons', () => {
        it('should return all pokémons', async () => {
            await server.inject({
                method: 'POST',
                url: '/pokemons',
                payload: { tipo: 'pikachu', treinador: 'Ash' }
            });

            await server.inject({
                method: 'POST',
                url: '/pokemons',
                payload: { tipo: 'charizard', treinador: 'Misty' }
            });

            const response = await server.inject({
                method: 'GET',
                url: '/pokemons'
            });

            expect(response.statusCode).toBe(200);
            const result = JSON.parse(response.payload);
            expect(result).toHaveLength(2);
            expect(result[0].treinador).toBe('Ash');
            expect(result[1].treinador).toBe('Misty');
        });

        it('should return 404 when no pokémons exist', async () => {
            const response = await server.inject({
                method: 'GET',
                url: '/pokemons'
            });

            expect(response.statusCode).toBe(404);
            const result = JSON.parse(response.payload);
            expect(result.message).toBe('No Pokémons found');
        });
    });

    describe('PUT /pokemons/{id}', () => {
        it('should update a pokémon trainer', async () => {
            const createResponse = await server.inject({
                method: 'POST',
                url: '/pokemons',
                payload: { tipo: 'mewtwo', treinador: 'Brock' }
            });
            const createdPokemon = JSON.parse(createResponse.payload);

            const updateResponse = await server.inject({
                method: 'PUT',
                url: `/pokemons/${createdPokemon.id}`,
                payload: { treinador: 'Giovanni' }
            });

            expect(updateResponse.statusCode).toBe(204);

            const getResponse = await server.inject({
                method: 'GET',
                url: `/pokemons/${createdPokemon.id}`
            });
            const updatedPokemon = JSON.parse(getResponse.payload);
            expect(updatedPokemon.treinador).toBe('Giovanni');
        });

        it('should return 404 when updating non-existent pokémon', async () => {
            const response = await server.inject({
                method: 'PUT',
                url: '/pokemons/999',
                payload: { treinador: 'New Trainer' }
            });

            expect(response.statusCode).toBe(404);
        });
    });

    describe('DELETE /pokemons/{id}', () => {
        it('should delete a pokémon', async () => {
            const createResponse = await server.inject({
                method: 'POST',
                url: '/pokemons',
                payload: { tipo: 'pikachu', treinador: 'Ash' }
            });
            const createdPokemon = JSON.parse(createResponse.payload);

            const deleteResponse = await server.inject({
                method: 'DELETE',
                url: `/pokemons/${createdPokemon.id}`
            });

            expect(deleteResponse.statusCode).toBe(204);

            const getResponse = await server.inject({
                method: 'GET',
                url: `/pokemons/${createdPokemon.id}`
            });
            expect(getResponse.statusCode).toBe(404);
        });

        it('should return 404 when deleting non-existent pokémon', async () => {
            const response = await server.inject({
                method: 'DELETE',
                url: '/pokemons/999'
            });

            expect(response.statusCode).toBe(404);
        });
    });

    describe('Complete CRUD flow', () => {
        it('should perform complete CRUD operations', async () => {
            const createResponse = await server.inject({
                method: 'POST',
                url: '/pokemons',
                payload: { tipo: 'charizard', treinador: 'Lance' }
            });
            expect(createResponse.statusCode).toBe(201);
            const pokemon = JSON.parse(createResponse.payload);

            const getResponse = await server.inject({
                method: 'GET',
                url: `/pokemons/${pokemon.id}`
            });
            expect(getResponse.statusCode).toBe(200);

            const updateResponse = await server.inject({
                method: 'PUT',
                url: `/pokemons/${pokemon.id}`,
                payload: { treinador: 'Clair' }
            });
            expect(updateResponse.statusCode).toBe(204);

            const verifyResponse = await server.inject({
                method: 'GET',
                url: `/pokemons/${pokemon.id}`
            });
            const updatedPokemon = JSON.parse(verifyResponse.payload);
            expect(updatedPokemon.treinador).toBe('Clair');

            const deleteResponse = await server.inject({
                method: 'DELETE',
                url: `/pokemons/${pokemon.id}`
            });
            expect(deleteResponse.statusCode).toBe(204);

            const finalResponse = await server.inject({
                method: 'GET',
                url: `/pokemons/${pokemon.id}`
            });
            expect(finalResponse.statusCode).toBe(404);
        });
    });
});