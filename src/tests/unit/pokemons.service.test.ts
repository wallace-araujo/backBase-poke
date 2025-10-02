import {
    createPokemonService,
    updatePokemonService,
    deletePokemonService,
    getPokemonService,
    getAllPokemonsService
} from '../../services/pokemons.service';
import {
    createPokemonModel,
    updatePokemonModel,
    deletePokemonModel,
    getPokemonById,
    getAllPokemonsModel
} from '../../models/pokemons.model';

jest.mock('../../models/pokemons.model');

describe('Pokemons Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockPokemon = {
        id: 1,
        tipo: 'pikachu',
        treinador: 'Ash Ketchum',
        nivel: 1
    };

    describe('getPokemonService', () => {
        it('should return pokemon details', async () => {
            (getPokemonById as jest.Mock).mockResolvedValue(mockPokemon);

            const result = await getPokemonService(1);
            expect(result).toEqual(mockPokemon);
            expect(getPokemonById).toHaveBeenCalledWith(1);
        });

        it('should throw error when pokemon not found', async () => {
            (getPokemonById as jest.Mock).mockResolvedValue(null);

            await expect(getPokemonService(999)).rejects.toThrow('Pokémon not found');
        });
    });

    describe('getAllPokemonsService', () => {
        it('should return all pokemons', async () => {
            const mockPokemons = [mockPokemon, { ...mockPokemon, id: 2 }];
            (getAllPokemonsModel as jest.Mock).mockResolvedValue(mockPokemons);

            const result = await getAllPokemonsService();
            expect(result).toEqual(mockPokemons);
        });

        it('should throw error when no pokemons found', async () => {
            (getAllPokemonsModel as jest.Mock).mockResolvedValue([]);

            await expect(getAllPokemonsService()).rejects.toThrow('No Pokémons found');
        });
    });

    describe('createPokemonService', () => {
        it('should create a new pokemon with valid type', async () => {
            (createPokemonModel as jest.Mock).mockResolvedValue(mockPokemon);

            const result = await createPokemonService('pikachu', 'Ash Ketchum');

            expect(result).toEqual(mockPokemon);
            expect(createPokemonModel).toHaveBeenCalledWith('pikachu', 'Ash Ketchum');
        });

        it('should throw error with invalid pokemon type', async () => {
            await expect(createPokemonService('invalid-type', 'Ash Ketchum'))
                .rejects.toThrow('Invalid Pokémon type. Allowed types: charizard, mewtwo, pikachu');

            expect(createPokemonModel).not.toHaveBeenCalled();
        });
    });

    describe('updatePokemonService', () => {
        it('should update pokemon trainer', async () => {
            (updatePokemonModel as jest.Mock).mockResolvedValue(mockPokemon);

            const result = await updatePokemonService(1, 'New Trainer');

            expect(result).toEqual(mockPokemon);
            expect(updatePokemonModel).toHaveBeenCalledWith(1, 'New Trainer');
        });

        it('should throw error when pokemon to update not found', async () => {
            (updatePokemonModel as jest.Mock).mockResolvedValue(null);

            await expect(updatePokemonService(999, 'New Trainer'))
                .rejects.toThrow('Pokémon not found');
        });
    });

    describe('deletePokemonService', () => {
        it('should delete pokemon and return true', async () => {
            (deletePokemonModel as jest.Mock).mockResolvedValue(true);

            const result = await deletePokemonService(1);

            expect(result).toBe(true);
            expect(deletePokemonModel).toHaveBeenCalledWith(1);
        });

        it('should throw error when pokemon to delete not found', async () => {
            (deletePokemonModel as jest.Mock).mockResolvedValue(false);

            await expect(deletePokemonService(999))
                .rejects.toThrow('Pokémon not found');
        });
    });
});