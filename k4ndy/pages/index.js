import React, {useContext, useEffect, useRef, useState} from 'react';
import getConfig from 'next/config';
import AppConfig from '../layout/AppConfig';
import {LayoutContext} from '../layout/context/layoutcontext';
import CarouselPosts from '../demo/service/CarouselPosts';
import {Carousel} from "primereact/carousel";
import {Galleria} from "primereact/galleria";
import Posts from '../demo/components/Posts/Posts';
import {getPostsBySearch, getPostsInCarousel} from '../demo/actions/posts';
import Pagination from '../demo/components/paginacion/Pagination';
import { useRouter } from 'next/router';
import {useDispatch} from "react-redux";
import * as actionType from "../demo/constants/actionTypes";
import decode from 'jwt-decode';
import CustomHeader from "../demo/components/UserHeader/CustomHeader";
import SearchCity from "../demo/components/SearchCity";
import HotBanner from "../demo/components/HotBanner";
import TopBanner from "../demo/components/TopBanner";
import Link from "next/link";
import Head from "next/head";

function useQuery() {
    return new URLSearchParams(useRouter().query);
}

function LandingPage() {

    const [darkMode, setDarkMode] = useState(false);
    const {layoutConfig} = useContext(LayoutContext);

    useEffect(() => {
        setDarkMode(layoutConfig.colorScheme === 'dark' || layoutConfig.colorScheme === 'dim' ? true : false);
    }, [layoutConfig.colorScheme]);

    const [user, setUser] = useState(null);
    //const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('profile'));
        setUser(data);
    }, []);


    useEffect(() => {

        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));

    },[]);

    const query = useQuery();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');

    const [currentId, setCurrentId] = useState(0);
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
     const history = useRouter();

    // const searchPost = () => {
    //     if (search.trim() || tags) {
    //         dispatch(getPostsBySearch({search, tags: tags.join(',')}));
    //         history(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
    //     } else {
    //         history('/');
    //     }
    // };




    const logout = () => {
        dispatch({ type: actionType.LOGOUT });

        history.push('/');

        setUser(null);

        window.location.reload(false);
    };



    return (
        <>
            <Head>
                <title>Anuncios clasificados gratis para adultos en Ecuador - k4ndy</title>
            </Head>
        <HotBanner/>
        <div className="relative overflow-hidden flex flex-column justify-content-center">
            <div className="bg-circle opacity-50" style={{top: '-200px', left: '-700px'}}></div>
            <div className="bg-circle hidden lg:flex"
                 style={{top: '50px', right: '-800px', transform: 'rotate(60deg)'}}></div>
            <div className="landing-wrapper">

                <CustomHeader/>
                <SearchCity/>

                <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-10 lg:px-10 z-2">

                    <div id="apps" className="my-6 md:my-10">

                        <div className="flex flex-column lg:flex-row align-items-center justify-content-between mt-10 gap-10">


                            <div className="col-12">

                                    <TopBanner/>

                                    <Posts setCurrentId={setCurrentId}/>
                                    {(!searchQuery && !tags.length) && (
                                        <div className="card">
                                            <Pagination page={page}/>
                                        </div>
                                    )}

                            </div>

                        </div>
                    </div>

                    <div className="grid justify-content-between my-6 pt-4 md:my-8">
                        <div className="col-12 md:col-2 text-center md:text-left">
                            <Link className="cursor-pointer" href="/">

                                <img src={`layout/images/logo-k4ndy.png`} style={{height: '40px'}} alt="app-name" />

                            </Link>
                        </div>


                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

LandingPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig minimal/>
        </React.Fragment>
    );
};

export default LandingPage;
