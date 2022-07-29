import { useWeb3React } from "@web3-react/core";
import { useCallback, useEffect, useState } from "react";
import useRocketPunks from "../useRocketPunks";

const getPunkData = async ({ rocketPunks, tokenId }) => {
  const [
    tokenURI,
    dna,
    owner,
    accessoriesType,
    clotheColor,
    clotheType,
    eyeType,
    eyeBrowType,
    facialHairColor,
    facialHairType,
    hairColor,
    hatColor,
    graphicType,
    mouthType,
    skinColor,
    topType,
  ] = await Promise.all([
    rocketPunks.methods.tokenURI(tokenId).call(),
    rocketPunks.methods.tokenDNA(tokenId).call(),
    rocketPunks.methods.ownerOf(tokenId).call(),
    rocketPunks.methods.getAccessoriesType(tokenId).call(),
    rocketPunks.methods.getAccessoriesType(tokenId).call(),
    rocketPunks.methods.getClotheColor(tokenId).call(),
    rocketPunks.methods.getClotheType(tokenId).call(),
    rocketPunks.methods.getEyeType(tokenId).call(),
    rocketPunks.methods.getEyeBrowType(tokenId).call(),
    rocketPunks.methods.getFacialHairColor(tokenId).call(),
    rocketPunks.methods.getFacialHairType(tokenId).call(),
    rocketPunks.methods.getHairColor(tokenId).call(),
    rocketPunks.methods.getHatColor(tokenId).call(),
    rocketPunks.methods.getGraphicType(tokenId).call(),
    rocketPunks.methods.getMouthType(tokenId).call(),
    rocketPunks.methods.getSkinColor(tokenId).call(),
    rocketPunks.methods.getTopType(tokenId).call(),
  ]);

  const responseMetadata = await fetch(tokenURI);
  const metadata = await responseMetadata.json();

  return {
    tokenId,
    attributes: {
      accessoriesType,
      clotheColor,
      clotheType,
      eyeType,
      eyeBrowType,
      facialHairColor,
      facialHairType,
      hairColor,
      hatColor,
      graphicType,
      mouthType,
      skinColor,
      topType,
    },
    tokenURI,
    dna,
    owner,
    ...metadata,
  };
};

// Plural
const useRocketPunksData = ({ owner = null } = {}) => {
  const [punks, setPunks] = useState([]);
  const { library } = useWeb3React();
  const [loading, setLoading] = useState(true);
  const rocketPunks = useRocketPunks();

  const update = useCallback(async () => {
    if (rocketPunks) {
      setLoading(true);

      let tokenIds;

      if (!library.utils.isAddress(owner)) {
        const totalSupply = await rocketPunks.methods.totalSupply().call();
        tokenIds = new Array(Number(totalSupply))
          .fill()
          .map((_, index) => index);
      } else {
        const balanceOf = await rocketPunks.methods.balanceOf(owner).call();

        const tokenIdsOfOwner = new Array(Number(balanceOf))
          .fill()
          .map((_, index) =>
            rocketPunks.methods.tokenOfOwnerByIndex(owner, index).call()
          );

        tokenIds = await Promise.all(tokenIdsOfOwner);
      }

      const punksPromise = tokenIds.map((tokenId) =>
        getPunkData({ tokenId, rocketPunks })
      );

      const punks = await Promise.all(punksPromise);

      setPunks(punks);
      setLoading(false);
    }
  }, [rocketPunks, owner, library?.utils]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punks,
    update,
  };
};

// Singular
const useRocketPunkData = (tokenId = null) => {
  const [punk, setPunk] = useState({});
  const [loading, setLoading] = useState(true);
  const rocketPunks = useRocketPunks();

  const update = useCallback(async () => {
    if (rocketPunks && tokenId != null) {
      setLoading(true);

      const toSet = await getPunkData({ tokenId, rocketPunks });
      setPunk(toSet);

      setLoading(false);
    }
  }, [rocketPunks, tokenId]);

  useEffect(() => {
    update();
  }, [update]);

  return {
    loading,
    punk,
    update,
  };
};

export { useRocketPunksData, useRocketPunkData };
