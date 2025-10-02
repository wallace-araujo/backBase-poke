import {
    createPokemonModel,
    updatePokemonModel,
    deletePokemonModel,
    getPokemonById,
    getAllPokemonsModel
} from '../../models/pokemons.model';
import { query } from '../../config/database';

jest.mock('../../config/database');

describe('Pokemons Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockPokemon = {
        id: 1,
        tipo: 'pikachu',
        treinador: 'Ash Ketchum',
        nivel: 1,
        created_at: new Date(),
        updated_at: new Date()
    };

    describe('getPokemonById', () => {
        it('should return a pokemon when it exists', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [mockPokemon] });

            const result = await getPokemonById(1);
            expect(result).toEqual(mockPokemon);
            expect(query).toHaveBeenCalledWith('SELECT * FROM pokemons WHERE id = ?', [1]);
        });

        it('should return null when pokemon does not exist', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await getPokemonById(999);
            expect(result).toBeNull();
            expect(query).toHaveBeenCalledWith('SELECT * FROM pokemons WHERE id = ?', [999]);
        });
    });


    describe('getAllPokemonsModel', () => {
        it('should return all pokemons', async () => {
            const mockPokemons = [mockPokemon, { ...mockPokemon, id: 2, treinador: 'Misty' }];
            (query as jest.Mock).mockResolvedValue({ rows: mockPokemons });

            const result = await getAllPokemonsModel();
            expect(result).toEqual(mockPokemons);
            expect(query).toHaveBeenCalledWith('SELECT * FROM pokemons ORDER BY id', []);
        });

        it('should return empty array when no pokemons exist', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await getAllPokemonsModel();
            expect(result).toEqual([]);
        });
    });

    describe('createPokemonModel', () => {
        it('should create a new pokemon', async () => {
            const newPokemon = {
                tipo: 'charizard',
                treinador: 'Brock'
            };

            const createdPokemon = {
                id: 1,
                tipo: 'charizard',
                treinador: 'Brock',
                nivel: 1,
                created_at: new Date('2025-01-01T00:00:00.000Z'),
                updated_at: new Date('2025-01-01T00:00:00.000Z')
            };

            (query as jest.Mock).mockResolvedValue({
                rows: [createdPokemon]
            });

            const result = await createPokemonModel(newPokemon.tipo, newPokemon.treinador);

            expect(result).toEqual(createdPokemon);
            expect(query).toHaveBeenCalledWith(
                `INSERT INTO pokemons (tipo, treinador, nivel, created_at, updated_at) 
         VALUES ($1, $2, $3, NOW(), NOW()) 
         RETURNING *`,
                ['charizard', 'Brock', 1]
            );
        });
    });

    describe('updatePokemonModel', () => {
        it('should update pokemon trainer', async () => {
            const mockQuery = query as jest.Mock;
            mockQuery.mockReset();

            const expectedPokemon = {
                id: 1,
                tipo: 'pikachu',
                treinador: 'New Trainer',
                nivel: 1,
                created_at: new Date('2025-01-01T00:00:00.000Z'),
                updated_at: new Date('2025-01-01T00:00:00.000Z')
            };

            mockQuery.mockResolvedValue({ rows: [expectedPokemon] });

            const result = await updatePokemonModel(1, 'New Trainer');


            expect(result).toEqual(expectedPokemon);

            expect(mockQuery).toHaveBeenCalledWith(
                `UPDATE pokemons 
         SET treinador = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
                ['New Trainer', 1]
            );
        });

        it('should return null when pokemon to update does not exist', async () => {
            (query as jest.Mock).mockResolvedValue({ rows: [] });

            const result = await updatePokemonModel(999, 'New Trainer');
            expect(result).toBeNull();
        });
    });

    describe('deletePokemonModel', () => {
        it('should delete pokemon and return true', async () => {
            (query as jest.Mock).mockResolvedValue({ rowCount: 1 });

            const result = await deletePokemonModel(1);

            expect(result).toBe(true);
            expect(query).toHaveBeenCalledWith('DELETE FROM pokemons WHERE id = $1', [1]);
        });

        it('should return false when pokemon to delete does not exist', async () => {
            (query as jest.Mock).mockResolvedValue({ rowCount: 0 });

            const result = await deletePokemonModel(999);
            expect(result).toBe(false);
        });
    });
});