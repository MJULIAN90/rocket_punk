import { useMemo } from 'react';
import { useWeb3React } from '@web3-react/core';
import RocketPunksArtifact from '../../config/web3/artifacts/RocketPunks';

const { address, abi } = RocketPunksArtifact;

const useRocketPunks = () => {
  const {active, library, chainId} = useWeb3React();

  const rocketPunks = useMemo(
    () => {
      if (active) return new library.eth.Contract(abi, address[chainId]);
    },
    [active, chainId, library?.eth?.Contract]
  );

  return rocketPunks

}

export default useRocketPunks;