import React from 'react'

const StakeNFTBox = ({nftBalance,pendingRewards, stakeNFT,claim,unstake}) => {
    return <div className='mainNFTBox' >
        <div className='title'>Goblin AI NFTs</div>
        <p>Stake your NFT to earn tokens. <br/>No lock requirement!</p>
        <div className='nfts'>Your NFTs: {nftBalance}</div>
        <button onClick={stakeNFT}>Stake</button>
        <div className='pending'>Pending Rewards: {pendingRewards}</div>
        <button onClick={claim}>Claim</button>
        <button onClick={unstake}>Unstake</button>
    </div>
}

export default StakeNFTBox;