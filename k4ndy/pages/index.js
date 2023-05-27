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



    //Ejemplo sin utilizar Redux React
    const [postsInCarousel, setProducts, isLoading] = useState([])
    const productService = new CarouselPosts();

    useEffect(() => {
        productService.getProductsSmall().then(data => setProducts(data.slice(0, 9)));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '600px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '480px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    //Ejemplo utilizar Redux React || Revisar inconvenientes.
    // const {postsInCarousel, isLoading} = useSelector((state) => state.posts);
    // console.log("1 "+postsInCarousel);

    // useEffect(() => {
    //     dispatch(getPostsInCarousel());
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const galleriaResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];
    const galleriaItemTemplate = (item) => {
        return <img src={item} style={{width: '100%', display: 'block'}}/>
    }

    const openPost = (e) => {
        //dispatch(getPost(post._id, history));
        console.log(e._id);
        history.push(`apps/blog/detail?id=${e._id}`);
    };

    //Número de teléfono WhatsApp
    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const productTemplate = (postsInCarousel) => {
        return (
            <div className="product-item">
                <div className="product-item-content">
                    <div className="mb-3" onClick={() => openPost(postsInCarousel)}>
                        {/*<img src={`images/product/${product.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={product.name} className="product-image" />*/}
                        <Galleria value={postsInCarousel.selectedFile.map((pic) => (pic))}
                                  responsiveOptions={galleriaResponsiveOptions} numVisible={10} circular
                                  style={{maxWidth: '800px', margin: 'auto'}} item={galleriaItemTemplate} autoPlay
                                  transitionInterval={2000} showThumbnails={false}
                                  showIndicators></Galleria>

                    </div>
                    <div>
                        {/*<h4 className="mb-1">{posts.title}</h4>*/}
                        <span
                            className="inline-flex align-items-center py-2 px-3 font-medium border-1 surface-border border-round">
                        <i className="pi pi-whatsapp mr-2"></i>
                        <span className="font-semibold"
                              onClick={() => openInNewTab('https://wa.me/593' + postsInCarousel.cellphone + '?text=' + postsInCarousel.title)}>WhatsApp</span>
                    </span>
                        <div className="text-900 font-semibold text-xl mb-3">{postsInCarousel.title}</div>
                        {/*<h6 className="mt-0 mb-3">${product.price}</h6>*/}
                        {/*<span className={`product-badge status-${product.inventoryStatus.toLowerCase()}`}>{product.inventoryStatus}</span>*/}
                        {/*<div className="car-buttons mt-5">*/}
                        {/*    <Button icon="pi pi-search" className="p-button p-button-rounded mr-2" />*/}
                        {/*    <Button icon="pi pi-star-fill" className="p-button-success p-button-rounded mr-2" />*/}
                        {/*    <Button icon="pi pi-cog" className="p-button-help p-button-rounded" />*/}
                        {/*</div>*/}
                    </div>
                </div>
            </div>
        );
    }


    return (
        <>
        <div className="bg-primary text-gray-100 p-3 flex justify-content-center align-items-center flex-wrap" style={{textAlign: "center"}}>
            {/*<div className="font-bold mr-8">🔥 Alerta!</div>*/}
            {/*<div className="align-items-center hidden lg:flex">*/}
            {/*    <span className="line-height-3">K4NDY no es una agencia de escorts, sólo un sitio de encuentros seguro.</span>*/}
            {/*</div>*/}

            <a className="flex-wrap align-items-center">
                <span className="underline font-bold">🔥K4NDY es sólo una plataforma de encuentros seguros, no es una agencia de escorts.</span>
            </a>
            {/*<a className="flex align-items-center no-underline justify-content-center border-circle text-100 hover:bg-bluegray-700 cursor-pointer transition-colors transition-duration-150" style={{ width: '2rem', height: '2rem' }}>*/}
            {/*    <i className="pi pi-times"></i>*/}
            {/*</a>*/}
        </div>
        <div className="relative overflow-hidden flex flex-column justify-content-center">
            <div className="bg-circle opacity-50" style={{top: '-200px', left: '-700px'}}></div>
            <div className="bg-circle hidden lg:flex"
                 style={{top: '50px', right: '-800px', transform: 'rotate(60deg)'}}></div>
            <div className="landing-wrapper">

                <CustomHeader/>

                <div className="py-4 px-4 mx-0 md:mx-6 lg:mx-10 lg:px-10 z-2">

                    <div id="apps" className="my-6 md:my-10">

                        <div className="flex flex-column lg:flex-row align-items-center justify-content-between mt-10 gap-10">


                            <div className="col-12">



                                    {
                                        isLoading ?
                                            <img src={`layout/images/5db61a9d71fa2c97ffff30c83dcaa6e5.gif`}
                                                 style={{
                                                     height: '100%',
                                                     display: "block",
                                                     marginLeft: "auto",
                                                     marginRight: "auto",
                                                     width: "50%"
                                                 }}/>
                                            : (
                                                <Carousel value={postsInCarousel} numVisible={4} numScroll={1}
                                                          responsiveOptions={responsiveOptions}
                                                          autoplayInterval={3000} itemTemplate={productTemplate}
                                                          header={<h5 style={{textAlign: "center"}}>🍭K4NDY ♥️ 🍑PARÁ CUMPLIR
                                                              🔥😈🍑TUS FANTASÍAS 🍭💯🍓</h5>}/>
                                            )}


                                <div className="card">

                                    <Posts setCurrentId={setCurrentId}/>
                                    {(!searchQuery && !tags.length) && (
                                        <div className="card">
                                            <Pagination page={page}/>
                                        </div>
                                    )}

                                </div>
                            </div>


                        </div>
                    </div>


                    <div className="grid justify-content-between my-6 pt-4 md:my-8">
                        <div className="col-12 md:col-2 text-center md:text-left">
                            <a className="cursor-pointer" href="/">

                                <img src={`layout/images/logo-k4ndy.png`} style={{height: '40px'}} alt="app-name" />

                            </a>
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
