import React, {useEffect} from "react";
import Link from "next/link";

const HotBanner = () => {

    return (

        <div id="hot-banner"
             className="bg-primary text-gray-100 flex justify-content-center align-items-center flex-wrap"
             style={{textAlign: "center"}}>
            <a className="flex-wrap align-items-center">
                <span className="underline font-bold">🔥K4NDY es una plataforma de citas seguras, no es una agencia de escorts.</span>
                {/*<span>*/}
                {/*     <i className="pi pi-telegram" style={{fontSize: '1rem'}}></i>*/}
                {/*    Bienvenido a nuestro canal<em style={{color: "red"}}> 18+ </em>*/}
                {/*    <Link style={{color: "white"}} href={`https://t.me/+ngCrW98FWCw3ZWYx`}>Telegram</Link>*/}
                {/*🔥*/}
                {/*</span>*/}
            </a>
            <a className="flex align-items-center no-underline justify-content-center border-circle text-100 hover:bg-bluegray-700 cursor-pointer transition-colors transition-duration-150"
               style={{width: '2rem', height: '2rem'}}>
                <i className="pi pi-times"></i>
            </a>
        </div>


    )
}

export default HotBanner;
