import Web3 from "web3";
import { InjectedConnector } from '@web3-react/injected-connector';

const connector = new InjectedConnector({ 
  supporterChainIds: [
    4
  ] });

const getLibrary = (provider) => {
  return new Web3(provider);
}

export {getLibrary, connector};