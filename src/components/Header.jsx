import React from 'react'

const Header = ({connect,wallet}) =>{
    return <div className='header '>
        <div className='name slide-bottom'>Goblin AI Stake</div>
        {wallet? `${wallet.slice(0,6)}...${wallet.slice(37,42)}` : <button onClick={connect}>Connect Wallet</button>}
    </div>
}

export default Header