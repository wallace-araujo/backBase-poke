CREATE TABLE IF NOT EXISTS pokemons (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('charizard', 'mewtwo', 'pikachu')),
    treinador VARCHAR(100) NOT NULL,
    nivel INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pokemons_id ON pokemons(id);
CREATE INDEX IF NOT EXISTS idx_pokemons_tipo ON pokemons(tipo);