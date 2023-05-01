import React, { useState } from "react";
import { useQuery } from "@apollo/client";
import { FETCH_POKEMONS } from "../graphql/queries/pokedex-queries";

const Pokedex = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const [limit, setLimit] = useState(20);
  const { loading, error, data, refetch, networkStatus } = useQuery(
    FETCH_POKEMONS,
    {
      variables: { first: limit },
      notifyOnNetworkStatusChange: true,
    }
  );
  const { pokemons } = data || {};
  if (loading || networkStatus === 4) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error</div>;
  }

  const handleBackBtnClick = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleForwardBtnClick = async () => {
    setCurrentPage((prevPage) => prevPage + 1);
    if (pokemons.length === currentPage * limit) {
      await refetch({ first: pokemons.length + limit });
    }
  };

  const getCurrentPageData = (pokemons) => {
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
            alt="No Pokemon Found"
            className="mx-auto w-32 h-32"
          />
          <p className="text-gray-500 mt-4">No Pokemon Found</p>
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
        {currentPagePokemons.map((pokemon) => (
          <div key={pokemon.name} className="bg-white rounded-lg p-4 shadow-md">
            <img
              src={pokemon.image}
              alt={pokemon.name}
              className="mx-auto mb-4"
            />
            <div className="text-center">
              <h2 className="text-lg font-bold">{pokemon.name}</h2>
              <p className="text-gray-700">{`Type: ${pokemon.type}`}</p>
              <p className="text-gray-700">{`Weakness: ${pokemon.weakness}`}</p>
            </div>
          </div>
        ))}
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

export default Pokedex;
