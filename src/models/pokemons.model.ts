import { query } from '../config/database';

export interface Pokemon {
    id: number;
    tipo: string;
    treinador: string;
    nivel: number;
    created_at?: Date;
    updated_at?: Date;
}




export const createPokemonModel = async (tipo: string, treinador: string): Promise<Pokemon> => {
    const result = await query(
        `INSERT INTO pokemons (tipo, treinador, nivel, created_at, updated_at) 
         VALUES ($1, $2, $3, NOW(), NOW()) 
         RETURNING *`,
        [tipo, treinador, 1]
    );
    return result.rows[0];
};


export const updatePokemonModel = async (id: number, treinador: string): Promise<Pokemon | null> => {
    const result = await query(
        `UPDATE pokemons 
         SET treinador = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [treinador, id]
    );
    return result.rows[0] || null;
};

export const deletePokemonModel = async (id: number): Promise<boolean> => {
    const result = await query(
        'DELETE FROM pokemons WHERE id = $1',
        [id]
    );
    return (result.rowCount || 0) > 0;
};

export const getPokemonById = async (id: number): Promise<Pokemon | null> => {
    const result = await query(
        'SELECT * FROM pokemons WHERE id = $1',
        [id]
    );
    return result.rows[0] || null;
};

export const getAllPokemonsModel = async (): Promise<Pokemon[]> => {
    const result = await query('SELECT * FROM pokemons ORDER BY id', []);
    return result.rows;
};

export const updatePokemonLevelModel = async (id: number, nivel: number): Promise<Pokemon | null> => {
    const result = await query(
        `UPDATE pokemons 
         SET nivel = $1, updated_at = NOW() 
         WHERE id = $2 
         RETURNING *`,
        [nivel, id]
    );
    return result.rows[0] || null;
};


export const getPokemonsByIds = async (ids: number[]): Promise<Pokemon[]> => {
    if (ids.length === 0) return [];

    const placeholders = ids.map((_, index) => `$${index + 1}`).join(',');
    const result = await query(
        `SELECT * FROM pokemons WHERE id IN (${placeholders})`,
        ids
    );
    return result.rows;
};