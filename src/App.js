import React, { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import StakeNFTBox from "./components/StakeNFTBox";
import StakeTokenBox from "./components/StakeTokenBox";
import StakeTokenNFTBox from "./components/StakeTokenNFTBox";
import InfoBox from "./components/InfoBox";
import { ethers } from "ethers";
import NFT from "../src/abi/Goblinz.json";
import Goblinz from "../src/abi/GoblinZtake.json";
import { nft } from "../src/abi/address";
import { stake } from "../src/abi/address";

const App = () => {
  const [wallet, setWallet] = useState(null);
  const [NFTContract, setNFTContract] = useState();
  const [stakeContract, setStakeContract] = useState();
  const [nftBalance, setNftBalance] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);

  const connect = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    const network = await provider.getNetwork();

    if (network.chainId !== 18159) {
      alert("Please change to Proof Of Memes Network")
    }
    const signer = provider.getSigner();
    setWallet(accounts[0]);
    setContracts(signer);
  };

  const setContracts = (signer) => {
    const nftContract = new ethers.Contract(nft, NFT, signer);
    const stakingContract = new ethers.Contract(stake, Goblinz, signer);
    setNFTContract(nftContract);
    setStakeContract(stakingContract);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (wallet && NFTContract) {
        const nftAmount = await NFTContract.balanceOf(wallet);
        setNftBalance(ethers.utils.formatUnits(nftAmount, 0));
        const token = await NFTContract.ownerOfToken(wallet);
        console.log(ethers.utils.formatUnits(token, 0));
        try {
          const pending = await stakeContract.pendingRewards(token);
          setPendingRewards(ethers.utils.formatUnits(pending, 0));
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [NFTContract, stakeContract]);

  const stakeNFT = async () => {
    if (stakeContract && NFTContract) {
      const token = await NFTContract.ownerOfToken(wallet);
      const formatedToken = ethers.utils.formatUnits(token, 0);
      console.log(formatedToken);
      const approve = await NFTContract.approve(stake, formatedToken);
      await approve.wait();
      const staked = await stakeContract.stakeNFT(formatedToken);
    }
  };

  const claim = async () => {
    if (stakeContract && wallet) {
      const token = await NFTContract.ownerOfToken(wallet);
      const formatedToken = ethers.utils.formatUnits(token, 0);
      await stakeContract.claimWithoutUnstake(formatedToken);
    }
  };

  const unstake = async () => {
    if (stakeContract && wallet) {
      const token = await NFTContract.ownerOfToken(wallet);
      const formatedToken = ethers.utils.formatUnits(token, 0);
      await stakeContract.claimAndUnstake(formatedToken);
    }
  };

  return (
    <div className='App'>
      <div className='containerA'>
        <Header connect={connect} wallet={wallet} />
      </div>
      <div className='containerB'>
        <InfoBox />
      </div>
      <div className='containerC'>
        <StakeNFTBox
          nftBalance={nftBalance}
          pendingRewards={pendingRewards}
          stakeNFT={stakeNFT}
          claim={claim}
          unstake={unstake}
        />
        <StakeTokenBox />
        <StakeTokenNFTBox nftBalance={nftBalance} />
      </div>
    </div>
  );
};

export default App;
