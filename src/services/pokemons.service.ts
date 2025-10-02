import {
    createPokemonModel,
    updatePokemonModel,
    deletePokemonModel,
    getPokemonById,
    getAllPokemonsModel,
    updatePokemonLevelModel,
    getPokemonsByIds
} from '../models/pokemons.model';




export const createPokemonService = async (tipo: string, treinador: string) => {
    const allowedTypes = ['charizard', 'mewtwo', 'pikachu'];
    if (!allowedTypes.includes(tipo)) {
        throw new Error('Invalid Pokémon type. Allowed types: charizard, mewtwo, pikachu');
    }

    const pokemon = await createPokemonModel(tipo, treinador);
    return pokemon;
};

export const updatePokemonService = async (id: number, treinador: string) => {
    const pokemon = await updatePokemonModel(id, treinador);

    if (!pokemon) {
        throw new Error('Pokémon not found');
    }

    return pokemon;
};

export const deletePokemonService = async (id: number) => {
    const deleted = await deletePokemonModel(id);

    if (!deleted) {
        throw new Error('Pokémon not found');
    }

    return deleted;
};

export const getPokemonService = async (id: number) => {
    const pokemon = await getPokemonById(id);

    if (!pokemon) {
        throw new Error('Pokémon not found');
    }

    return pokemon;
};

export const getAllPokemonsService = async () => {
    const pokemons = await getAllPokemonsModel();

    if (!pokemons || pokemons.length === 0) {
        throw new Error('No Pokémons found');
    }

    return pokemons;
};

export const battlePokemonsService = async (pokemonAId: number, pokemonBId: number): Promise<any> => {
    const pokemons = await getPokemonsByIds([pokemonAId, pokemonBId]);

    if (pokemons.length !== 2) {
        throw new Error('Pokémon not found');
    }

    const pokemonA = pokemons.find(p => p.id === pokemonAId);
    const pokemonB = pokemons.find(p => p.id === pokemonBId);

    if (!pokemonA || !pokemonB) {
        throw new Error('Pokémon not found');
    }

    if (pokemonAId === pokemonBId) {
        throw new Error('Um pokémon não pode batalhar consigo mesmo');
    }

    const totalLevel = pokemonA.nivel + pokemonB.nivel;
    const pokemonAChance = pokemonA.nivel / totalLevel;

    const random = Math.random();

    console.log('battlePokemonsService', random, pokemonAChance, random < pokemonAChance);

    let vencedor: any;
    let perdedor: any;

    if (random < pokemonAChance) {
        vencedor = pokemonA;
        perdedor = pokemonB;
    } else {
        vencedor = pokemonB;
        perdedor = pokemonA;
    }

    console.log('vencedor', vencedor.id, 'perdedor', perdedor.id);


    const novoNivelVencedor = vencedor.nivel + 1;
    const novoNivelPerdedor = perdedor.nivel - 1;

    console.log('novoNivelVencedor', novoNivelVencedor, 'novoNivelPerdedor', novoNivelPerdedor);

    await updatePokemonLevelModel(vencedor.id, novoNivelVencedor);

    if (novoNivelPerdedor <= 0) {
        await deletePokemonModel(perdedor.id);
        perdedor.nivel = 0;
    } else {
        await updatePokemonLevelModel(perdedor.id, novoNivelPerdedor);
        perdedor.nivel = novoNivelPerdedor;
    }
    vencedor.nivel = novoNivelVencedor;

    return {
        vencedor,
        perdedor
    };
};