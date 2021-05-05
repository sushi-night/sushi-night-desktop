import { Button } from "@chakra-ui/button";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useToggleFavouriteMutation } from "../generated/graphql";
import { useAnimeState } from "../zustand";

interface IFavouriteProps {
  isFavourite: boolean | undefined;
}

export const Favourite: React.FC<IFavouriteProps> = ({ isFavourite }) => {
  const { animeId } = useAnimeState();
  const [_isFavourite, setIsFavourite] = useState(isFavourite);
  const [toggleFavourite, { loading }] = useToggleFavouriteMutation();

  return (
    <Button
      colorScheme="red"
      color={_isFavourite ? "red" : "ButtonText"}
      pl={2}
      pr={2}
      isLoading={loading}
      onClick={async () => {
        try {
          await toggleFavourite({ variables: { animeId } });
          setIsFavourite(!_isFavourite);
        } catch (err) {
          alert(err.toString());
        }
      }}
    >
      <FaHeart />
    </Button>
  );
};
