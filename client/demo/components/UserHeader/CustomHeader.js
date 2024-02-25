import {StyleClass} from "primereact/styleclass";
import {Ripple} from "primereact/ripple";
import {Button} from "primereact/button";
import React, {useContext, useEffect, useRef, useState} from "react";
import * as actionType from "../../constants/actionTypes";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import Link from "next/link";


function CustomHeader() {

    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    const menuRef = useRef();
    const history = useRouter();


    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('profile'));
        setUser(data);
    }, []);

    const logout = () => {
        dispatch({type: actionType.LOGOUT});

        history.push('/');

        setUser(null);

        window.location.reload(false);
    };

    return (

        <div
            className="flex align-items-center justify-content-between relative lg:static py-6 px-4 mx-0 md:px-7 lg:px-8 lg:py-6 lg:mx-8">

            <a href="/" className="cursor-pointer">
                <img src={`../../../layout/images/logo-k4ndy.png`} style={{height: '40px'}} alt="app-name"/>
            </a>

            <StyleClass nodeRef={menuRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden"
                        hideOnOutsideClick="true">
                <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block md:hidden text-700"></i>
            </StyleClass>

            <div
                className="align-items-center flex-grow-1 hidden md:flex absolute md:static w-full md:px-0 z-3 shadow-2 md:shadow-none fadein"
                style={{top: '80px', right: '0%'}}>


                {user?.result ? (
                    <ul className="list-none p-3 md:p-0 m-0 ml-auto flex md:align-items-center select-none flex-column md:flex-row cursor-pointer surface-card md:surface-ground">

                        <li>
                            <a className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>{user?.result.username}</span>
                            </a>
                            <Ripple/>
                        </li>

                        <li>
                            <a href="/apps/blog/edit/"
                               className="m-0 mt-3 md:mt-0 md:ml-5">
                                <i className="pi pi-fw pi-camera"></i>
                                +PUBLICAR
                            </a>
                            <Ripple/>
                        </li>

                        <li>
                            <Button type="button" label="Cerrar sesión" className="m-0 mt-3 md:mt-0 md:ml-5"
                                    onClick={logout}></Button>
                        </li>
                    </ul>
                ) : (

                    <ul className="list-none p-3 md:p-0 m-0 ml-auto flex md:align-items-center select-none flex-column md:flex-row cursor-pointer surface-card md:surface-ground">

                        <li>
                            <a href="/auth/login"
                               className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>Acceder</span>
                            </a>
                            <Ripple/>
                        </li>
                        <li>
                            <a href="/auth/register"
                               className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                                <span>Registrarse</span>
                            </a>
                            <Ripple/>
                        </li>


                    </ul>
                )}
            </div>
        </div>

    )
};

export default CustomHeader;
