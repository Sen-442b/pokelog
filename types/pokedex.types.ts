type PokemonSummary = {
  id: string;
  name: string;
  number: string; //not same as base 10 numbers
  types: string[];
  image: string;
};

interface PokemonSummaryQuery {
  pokemons: PokemonSummary[];
}
interface PokedexProps {
  pokemonsProps: PokemonSummary[];
}

export type { PokemonSummary, PokemonSummaryQuery, PokedexProps };
