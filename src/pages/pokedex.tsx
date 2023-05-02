import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { FETCH_POKEMONS } from "../graphql/queries/pokedex-queries";
import client from "@/graphql/apollo-client";
import {
  PokedexProps,
  PokemonSummary,
  PokemonSummaryQuery,
} from "../../types/pokedex.types";

const Pokedex = ({ pokemonsProps }: PokedexProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pokemons, setPokemons] = useState(pokemonsProps);
  const [loading, setLoading] = useState<boolean>(false);
  const [limit, setLimit] = useState(20);
  if (loading) {
    return <div>Loading...</div>;
  }

  const handleBackBtnClick = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleForwardBtnClick = async () => {
    setCurrentPage((prevPage) => prevPage + 1);
    if (pokemons.length === currentPage * limit) {
      setLoading(true);
      //await refetch({ first: pokemons.length + limit });
      try {
        const results = await client.query<PokemonSummaryQuery>({
          query: FETCH_POKEMONS,
          variables: { first: pokemons.length + limit },
        });
        setPokemons(results.data.pokemons);
      } catch (error) {
        console.log({ error });
      }
    }
    setLoading(false);
  };

  const getCurrentPageData = (pokemons: PokemonSummary[]) => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    return pokemons.slice(startIndex, endIndex);
  };

  const currentPagePokemons = getCurrentPageData(pokemons);

  if (!currentPagePokemons.length) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <img
            src="https://www.giantbomb.com/a/uploads/scale_small/13/135472/1892134-054psyduck.png"
            alt="No Pokemons Found"
            className="mx-auto w-32 h-32"
          />
          <p className="text-gray-500 mt-4">No Pokemons Found</p>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-yellow-500">
        Pokedex
      </h1>
      <div className="grid grid-cols-4 gap-4">
        {currentPagePokemons.map((pokemon) => {
          const { id, name, number, types, image } = pokemon;
          return (
            <div key={id} className="bg-white rounded-lg p-4 shadow-md">
              <img src={image} alt={name} className="mx-auto mb-4" />
              <div className="text-center">
                <p className="text-gray-200">{number}</p>
                <h2 className="text-lg font-bold text-gray-900">{name}</h2>
                <p className="text-gray-700">{`Type: ${types}`}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <button
          onClick={handleBackBtnClick}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-l ${
            currentPage === 1
              ? "disabled:opacity-50 disabled:cursor-not-allowed"
              : ""
          }`}
          disabled={currentPage === 1}
        >
          back
        </button>
        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r ${
            !currentPagePokemons.length
              ? "disabled:opacity-50 disabled:cursor-not-allowed"
              : ""
          }`}
          onClick={handleForwardBtnClick}
          disabled={!currentPagePokemons.length}
        >
          forth
        </button>
      </div>
    </div>
  );
};

export const getStaticProps = async () => {
  const { data } = await client.query({
    query: FETCH_POKEMONS,
    variables: { first: 60 }, //static
  });

  return { props: { pokemonsProps: data.pokemons } };
};

export default Pokedex;
