import React, { useState } from 'react';
import '../styles/Header.css';

import Logo from '../assets/images/logo.png';



const Header = () => {
    return (
        <header className="header" style={{backgroundColor:'black'}}>
            <div>
                <h1>KONINA</h1>
            </div>
            <div>
                <img src={Logo} alt='Logo изображение сайта' className="header-logo"/>
            </div>
            

        </header>
    )
};

export default Header