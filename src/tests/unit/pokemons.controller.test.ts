import {
    createPokemon,
    updatePokemon,
    deletePokemon,
    getPokemon,
    getAllPokemons
} from '../../routes/pokemon/pokemon.controller';
import {
    createPokemonService,
    updatePokemonService,
    deletePokemonService,
    getPokemonService,
    getAllPokemonsService
} from '../../services/pokemons.service';

jest.mock('../../services/pokemons.service');

describe('Pokemons Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const mockPokemon = {
        id: 1,
        tipo: 'pikachu',
        treinador: 'Ash Ketchum',
        nivel: 1
    };

    const mockRequest = (params = {}, payload = {}) => ({
        params,
        payload
    });

    const mockResponse = () => {
        const res: any = {};
        res.response = jest.fn().mockReturnValue(res);
        res.code = jest.fn().mockReturnValue(res);
        return res;
    };

    describe('createPokemon', () => {
        it('should create pokemon and return 201', async () => {
            const req = mockRequest({}, { tipo: 'pikachu', treinador: 'Ash Ketchum' });
            const h = mockResponse();
            (createPokemonService as jest.Mock).mockResolvedValue(mockPokemon);

            await createPokemon(req as any, h as any);

            expect(createPokemonService).toHaveBeenCalledWith('pikachu', 'Ash Ketchum');
            expect(h.response).toHaveBeenCalledWith(mockPokemon);
            expect(h.code).toHaveBeenCalledWith(201);
        });

        it('should return 400 on error', async () => {
            const req = mockRequest({}, { tipo: 'pikachu', treinador: 'Ash Ketchum' });
            const h = mockResponse();
            (createPokemonService as jest.Mock).mockRejectedValue(new Error('Invalid type'));

            await createPokemon(req as any, h as any);

            expect(h.response).toHaveBeenCalledWith({ message: 'Invalid type' });
            expect(h.code).toHaveBeenCalledWith(400);
        });
    });

    describe('getPokemon', () => {
        it('should return pokemon and 200 status', async () => {
            const req = mockRequest({ id: '1' });
            const h = mockResponse();
            (getPokemonService as jest.Mock).mockResolvedValue(mockPokemon);

            await getPokemon(req as any, h as any);

            expect(getPokemonService).toHaveBeenCalledWith(1);
            expect(h.response).toHaveBeenCalledWith(mockPokemon);
            expect(h.code).toHaveBeenCalledWith(200);
        });

        it('should return 404 when pokemon not found', async () => {
            const req = mockRequest({ id: '999' });
            const h = mockResponse();
            (getPokemonService as jest.Mock).mockRejectedValue(new Error('Pokémon not found'));

            await getPokemon(req as any, h as any);

            expect(h.response).toHaveBeenCalledWith({ message: 'Pokémon not found' });
            expect(h.code).toHaveBeenCalledWith(404);
        });
    });

    describe('updatePokemon', () => {
        it('should update pokemon and return 204', async () => {
            const req = mockRequest({ id: '1' }, { treinador: 'New Trainer' });
            const h = mockResponse();
            (updatePokemonService as jest.Mock).mockResolvedValue(mockPokemon);

            await updatePokemon(req as any, h as any);

            expect(updatePokemonService).toHaveBeenCalledWith(1, 'New Trainer');
            expect(h.response).toHaveBeenCalledWith();
            expect(h.code).toHaveBeenCalledWith(204);
        });

        it('should return 404 when pokemon to update not found', async () => {
            const req = mockRequest({ id: '999' }, { treinador: 'New Trainer' });
            const h = mockResponse();
            (updatePokemonService as jest.Mock).mockRejectedValue(new Error('Pokémon not found'));

            await updatePokemon(req as any, h as any);

            expect(h.response).toHaveBeenCalledWith({ message: 'Pokémon not found' });
            expect(h.code).toHaveBeenCalledWith(404);
        });
    });

    describe('deletePokemon', () => {
        it('should delete pokemon and return 204', async () => {
            const req = mockRequest({ id: '1' });
            const h = mockResponse();
            (deletePokemonService as jest.Mock).mockResolvedValue(true);

            await deletePokemon(req as any, h as any);

            expect(deletePokemonService).toHaveBeenCalledWith(1);
            expect(h.response).toHaveBeenCalledWith();
            expect(h.code).toHaveBeenCalledWith(204);
        });

        it('should return 404 when pokemon to delete not found', async () => {
            const req = mockRequest({ id: '999' });
            const h = mockResponse();
            (deletePokemonService as jest.Mock).mockRejectedValue(new Error('Pokémon not found'));

            await deletePokemon(req as any, h as any);

            expect(h.response).toHaveBeenCalledWith({ message: 'Pokémon not found' });
            expect(h.code).toHaveBeenCalledWith(404);
        });
    });

    describe('getAllPokemons', () => {
        it('should return all pokemons and 200 status', async () => {
            const mockPokemons = [mockPokemon, { ...mockPokemon, id: 2 }];
            const req = mockRequest();
            const h = mockResponse();
            (getAllPokemonsService as jest.Mock).mockResolvedValue(mockPokemons);

            await getAllPokemons(req as any, h as any);

            expect(getAllPokemonsService).toHaveBeenCalled();
            expect(h.response).toHaveBeenCalledWith(mockPokemons);
            expect(h.code).toHaveBeenCalledWith(200);
        });

        it('should return 404 when no pokemons found', async () => {
            const req = mockRequest();
            const h = mockResponse();
            (getAllPokemonsService as jest.Mock).mockRejectedValue(new Error('No Pokémons found'));

            await getAllPokemons(req as any, h as any);

            expect(h.response).toHaveBeenCalledWith({ message: 'No Pokémons found' });
            expect(h.code).toHaveBeenCalledWith(404);
        });
    });
});