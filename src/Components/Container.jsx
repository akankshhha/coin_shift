import React from 'react';
import Conversion from './Conversion';
import '../App.css'

const Container = () => {
    return (
        <>
            <header className='p-3 text-center'>
                <h1 className='fs-4 fw-bold'>Coin Shift 🪙</h1>
            </header>
            <div className='middle-section m-auto'>
                <Conversion />
            </div>
            <footer className='text-center p-3'>© <a href="https://www.exchangerate-api.com/">ExchangeRate-API</a> ❤️</footer>
        </>
    )
}

export default Container