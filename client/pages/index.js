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
import {useRouter} from 'next/router';
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

    }, []);

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
        dispatch({type: actionType.LOGOUT});

        history.push('/');

        setUser(null);

        window.location.reload(false);
    };

    const router = useRouter();
    const handleClick = () => {
        const categoria = 'escorts'; // Valor del país que deseas enviar
        // Enviar el valor del país a la página "[pais]/index.js" sin mostrarlo en la URL
        router.push(`/${categoria}/`, undefined, {shallow: true});
    };


    return (
        <>
            <Head>
                <title>Anuncios clasificados gratis para adultos en Ecuador - K0K4</title>
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

                            <div
                                className="flex flex-column lg:flex-row align-items-center justify-content-between mt-10 gap-10">


                                <div className="col-12">


                                    {/*<button onClick={handleClick}>Ir a la página de Escorts</button>*/}


                                    <div className="card text-center" style={{padding: "unset!important"}}>
                                        <div className="font-bold text-5xl text-900 mb-3">Encuentros calientes en tu
                                            ciudad
                                        </div>
                                        <div className="text-700 text-xl line-height-3 mb-5">ANUNCIOS CLASIFICADOS EN
                                            ECUADOR
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 ">
                                            {totalBlogs.map((blog, index) => (
                                                <div className="col-12 md:col-4" key={index}>
                                                    <div className="p-3">
                                                        <div className="surface-100 z-index border-round">
                                                            <div className="relative cursor-pointer" onClick={() => router.push(`/${blog.category}`)}>
                                                                <img src={blog.coverImage} className="w-full"
                                                                     alt={blog.description.split(' ', 1)}/>
                                                                {/*<img src={blog.profile} className="flex absolute w-4rem h-4rem"*/}
                                                                {/*     style={{bottom: '-1.5rem', right: '1.5rem'}}*/}
                                                                {/*     alt={blog.description.split(' ', 1)}/>*/}
                                                            </div>
                                                            <div className="p-3">
                                                                <div
                                                                    className="text-900 font-semibold text-xl mb-3">{blog.title}</div>
                                                                <p className="text-700 text-lg mt-0 mb-5">{blog.description}</p>

                                                                <div>
                                                                    {blog.city.map((cit, index) => (
                                                                        <div key={index} style={{padding: '1rem!important'}} className="card cursor-pointer" onClick={() => router.push(`/${blog.category}/${cit}`)}>
                                                                            <div className="text-900 font-semibold text-xl ">{blog.title}</div>
                                                                            <div style={{color: '#be206b!important'}} className="text-900 font-semibold text-xl " >{cit.charAt(0).toUpperCase() + cit.slice(1)}</div>
                                                                        </div>

                                                                        ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                </div>

                            </div>
                        </div>

                        <div className="grid justify-content-between my-6 pt-4 md:my-8">
                            <div className="col-12 md:col-2 text-center md:text-left">
                                <Link className="cursor-pointer" href="/">

                                    <img src={`layout/images/logo-k4ndy.png`} style={{height: '40px'}} alt="app-name"/>

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


const totalBlogs = [
    {
        coverImage: '/demo/images/escorts.jpg',
        profile: '/layout/images/logo-k4ndy.png',
        title: 'Escorts',
        description: 'Encuentra en Ecuador a las mejores escorts que te ofrecen gran variedad de servicios eróticos. Anímate y no esperes más!',
        comment: 2,
        share: 7,
        day: '15',
        month: 'Julio',
        category: 'escorts',
        city: ['guayaquil', 'quito', 'cuenca']
    },
    {
        coverImage: '/demo/images/travestis.jpg',
        profile: '/demo/images/avatar/circle/avatar-f-2.png',
        title: 'Trans Y Travestis',
        description: 'Atrévete a probar todas las aristas del placer con las más sexys trans y travestis de Ecuador. No pierdas la oportunidad de conocerlas. Son chicas dispuestas a todo y sólo esperan tu llamada.',
        comment: 5,
        share: 1,
        day: '20',
        month: 'Julio',
        category: 'travestis',
        city: ['guayaquil', 'quito', 'cuenca']
    },
    {
        coverImage: '/demo/images/escorts-masculinos.jpg',
        profile: '/demo/images/avatar/circle/avatar-m-1.png',
        title: 'Escorts Masculinos',
        description: 'Encuentra escorts y acompañantes masculinos en Ecuador.Disfruta de encuentros con hombres.Anímate, haz contacto o publica tu anuncio de forma gratuita.',
        comment: 2,
        share: 6,
        day: '23',
        month: 'Julio',
        category: 'escorts-masculinos',
        city: ['guayaquil', 'quito', 'cuenca']
    },
    {
        coverImage: '/demo/images/encuentros.jpg',
        profile: '/demo/images/avatar/circle/avatar-m-1.png',
        title: 'Encuentros Casuales',
        description: 'Encontrar citas y encuentros eróticos con quienes descubrir tu lado más ardiente.Swingers, lesbianas y busca amigos en Ecuador.',
        comment: 5,
        share: 5,
        day: '14',
        month: 'Julio',
        category: 'encuentros',
        city: ['guayaquil', 'quito', 'cuenca']
    }
    // ,
    // {
    //     coverImage: '/demo/images/blog/blog-5.png',
    //     profile: '/demo/images/avatar/circle/avatar-f-3.png',
    //     title: 'Live sex cam',
    //     description: 'Id eget arcu suspendisse ullamcorper dolor lobortis dui et morbi penatibus quam',
    //     comment: 4,
    //     share: 1,
    //     day: '05',
    //     month: 'Apr'
    // }
];

