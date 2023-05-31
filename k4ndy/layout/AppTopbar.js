import getConfig from 'next/config';
import { InputText } from 'primereact/inputtext';
import React, {forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState} from 'react';
import AppBreadcrumb from './AppBreadCrumb';
import { LayoutContext } from './context/layoutcontext';
import {Ripple} from "primereact/ripple";
import {Button} from "primereact/button";
import {useDispatch} from "react-redux";
import {useRouter} from "next/router";
import * as actionType from "../demo/constants/actionTypes";

const AppTopbar = forwardRef((props, ref) => {
    const { onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);


    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current
    }));



    const [user, setUser] = useState(null);
    const dispatch = useDispatch();
    const history = useRouter();


    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('profile'));
        setUser(data);
    }, []);

    const logout = () => {
        dispatch({type: actionType.LOGOUT});
        setUser(null);
        history.push('/');
    };

    return (
        <div className="layout-topbar">
            <div className="topbar-start">
                <button ref={menubuttonRef} type="button" className="topbar-menubutton p-link p-trigger" onClick={onMenuToggle}>
                    <i className="pi pi-bars"></i>
                </button>

                <AppBreadcrumb className="topbar-breadcrumb"></AppBreadcrumb>
            </div>

            <div className="topbar-end">
                <ul className="topbar-menu">
                    <li className="topbar-search">
                        {/*<span className="p-input-icon-left">*/}
                        {/*    <i className="pi pi-search"></i>*/}
                        {/*    <InputText type="text" placeholder="Search" className="w-12rem sm:w-full" />*/}
                        {/*</span>*/}

                        <a href="/"
                           className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3">
                            <span>Página Principal</span>
                        </a>
                        <Ripple/>
                    </li>
                    <li >
                        {/*<button type="button" className="p-link" onClick={showProfileSidebar}>*/}
                        {/*    <img src={`/layout/images/avatar.png`} alt="Profile" />*/}
                        {/*</button>*/}

                        <Button type="button" className="m-0 mt-3 md:mt-0 md:ml-5" label="Cerrar sesión" onClick={logout}>
                        </Button>
                    </li>
                </ul>
            </div>
        </div>
    );
});

export default AppTopbar;
