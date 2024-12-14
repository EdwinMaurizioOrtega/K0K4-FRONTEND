import React, {useEffect} from "react";

const HotBanner = () => {

    return (

        <div id="hot-banner"
             className="bg-primary text-gray-100 flex justify-content-center align-items-center flex-wrap"
             style={{textAlign: "center"}}>
            <a style={{color: "black"}} className="flex-wrap align-items-center" href="https://t.me/+ngCrW98FWCw3ZWYx">
                <span className="font-bold">🔥Bienvenido a nuestro canal<em style={{color: "red"}}> 18+ </em></span>
                Telegram
                <i className="pi pi-telegram" style={{fontSize: '1rem'}}></i>
            </a>
            <a className="flex align-items-center no-underline justify-content-center border-circle text-100 hover:bg-bluegray-700 cursor-pointer transition-colors transition-duration-150"
               style={{width: '2rem', height: '2rem'}}>
                <i className="pi pi-times"></i>
            </a>
        </div>


    )
}

export default HotBanner;
