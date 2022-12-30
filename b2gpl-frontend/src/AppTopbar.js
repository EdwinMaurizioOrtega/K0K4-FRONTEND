import React, { useEffect, useState } from 'react';
import { Link, Route, useNavigate, useLocation } from 'react-router-dom';
import AppMenu from './AppMenu';
import { classNames } from 'primereact/utils';

import { useDispatch } from 'react-redux';
import decode from 'jwt-decode';
import * as actionType from './constants/actionTypes';

const AppTopbar = (props) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const logout = () => {
        dispatch({ type: actionType.LOGOUT });

        navigate('/');

        setUser(null);

        window.location.reload(false);
    };

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);

    return (
        <>
            <div className="layout-topbar">
                <div className="layout-topbar-left">
                    {/*<button className="topbar-menu-button p-link" onClick={props.onMenuButtonClick}>*/}
                    {/*    <i className="pi pi-bars"></i>*/}
                    {/*</button>*/}

                    <button className="logo p-link" onClick={() => {
                        navigate('/')
                        window.location.reload(false);
                    }}>
                        <img src={`assets/layout/images/logo-${props.colorScheme === 'light' ? 'dark' : 'light'}.png`} alt="logo" />
                    </button>

                    <button className="p-link" onClick={() =>{
                        navigate('/')
                        window.location.reload(false);
                    }}>
                        <img src={`assets/layout/images/appname-${props.colorScheme === 'light' ? 'dark' : 'light'}.png`} className="app-name" alt="app-name" />
                    </button>
                </div>

                {/* <AppMenu
                    model={props.items}
                    menuMode={props.menuMode}
                    colorScheme={props.colorScheme}
                    menuActive={props.menuActive}
                    activeInlineProfile={props.activeInlineProfile}
                    onSidebarMouseOver={props.onSidebarMouseOver}
                    onSidebarMouseLeave={props.onSidebarMouseLeave}
                    toggleMenu={props.onToggleMenu}
                    onChangeActiveInlineMenu={props.onChangeActiveInlineMenu}
                    onMenuClick={props.onMenuClick}
                    onRootMenuItemClick={props.onRootMenuItemClick}
                    onMenuItemClick={props.onMenuItemClick}
                /> */}

                <div className="layout-topbar-right">
                    <ul className="layout-topbar-right-items">
                        {user?.result ? (

                                // <li className="p-link">
                                // <Link to={'/anuncio'} style={{ width: 'unset' }}>
                                //     <i className="pi pi-fw pi-camera"></i>
                                //     +PUBLICA TU ANUNCIO
                                // </Link>
                                //
                                // {/*<span variant="h6">{user?.result.name}</span>*/}
                                //
                                // <button className="p-link" onClick={logout}>
                                //     <i className="pi pi-fw pi-sign-out"></i>Cerrar sesión
                                // </button>
                                // </li>
                                //




                            <li id="profile" className={classNames('profile-item', { 'active-topmenuitem': props.topbarMenuActive })}>
                                 <Link to={'/anuncio'} style={{ width: 'unset' }}>
                                     <i className="pi pi-fw pi-camera"></i>
                                     +CREAR ANUNCIO
                                 </Link>
                                <button className="p-link" onClick={props.onTopbarItemClick}>

                                    <img src="assets/layout/images/profile-image.png" alt="profile" />

                                </button>
                                <span variant="h6">{user?.result.name}</span>

                                <ul className="fadeInDown">
                                    {/*<li role="menuitem">*/}
                                    {/*    <button className="p-link" onClick={onTopbarSubItemClick}>*/}
                                    {/*        <i className="pi pi-fw pi-user"></i>*/}
                                    {/*        <span>Profile</span>*/}
                                    {/*    </button>*/}
                                    {/*</li>*/}
                                    {/*<li role="menuitem">*/}
                                    {/*    <button className="p-link" onClick={onTopbarSubItemClick}>*/}
                                    {/*        <i className="pi pi-fw pi-cog"></i>*/}
                                    {/*        <span>Settings</span>*/}
                                    {/*    </button>*/}
                                    {/*</li>*/}
                                    <li role="menuitem">
                                        <button className="p-link" onClick={logout}>
                                            <i className="pi pi-fw pi-sign-out"></i>
                                            <span>Cerrar sesión</span>
                                        </button>
                                    </li>
                                </ul>
                            </li>





                        ) : (
                            <li className="p-link">
                                <Link to={'/login'} style={{ width: 'unset' }}>
                                    <i className="pi pi-fw pi-sign-out"></i>
                                    Acceder
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AppTopbar;
