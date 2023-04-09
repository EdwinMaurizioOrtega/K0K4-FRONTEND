import React, {useContext, useEffect, useRef, useState} from 'react';
import getConfig from 'next/config';
import {Button} from 'primereact/button';
import {Ripple} from 'primereact/ripple';
import {StyleClass} from 'primereact/styleclass';
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
import Post from "../demo/components/Posts/Post/Post";
import CustomHeader from "../demo/components/UserHeader/CustomHeader";



function useQuery() {
    return new URLSearchParams(useRouter().query);
}

function LandingPage() {

    const [darkMode, setDarkMode] = useState(false);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const {layoutConfig} = useContext(LayoutContext);
    const menuRef = useRef();

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

        Post
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
                                  responsiveOptions={galleriaResponsiveOptions} numVisible={7} circular
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
                            <a className="cursor-pointer" href="#">
                                {/*<svg width="124" height="22" viewBox="0 0 124 22" fill="none"*/}
                                {/*     xmlns="http://www.w3.org/2000/svg">*/}
                                {/*    <path*/}
                                {/*        d="M10.4851 0L0 20.9465H3.53702L10.4856 6.07843L17.2944 20.9465H20.9715L10.4851 0Z"*/}
                                {/*        fill="var(--primary-color)"/>*/}
                                {/*    <path d="M13.84 15.7927L16.2077 21.0016H11.7682L13.84 15.7927Z"*/}
                                {/*          fill="var(--primary-color)"/>*/}
                                {/*    <path d="M9.04645 21.0016L6.67875 15.7927L4.60701 21.0016H9.04645Z"*/}
                                {/*          fill="var(--primary-color)"/>*/}
                                {/*    <path*/}
                                {/*        d="M40.9033 14.5217H34.771L33.1753 18.0007H30.8467L37.9346 2.77661L44.772 18.0007H42.4062L40.9033 14.5217ZM40.022 12.49L37.8975 7.61938L35.6709 12.49H40.022Z"*/}
                                {/*        fill="var(--primary-color)"/>*/}
                                {/*    <path*/}
                                {/*        d="M52.4927 12.1838V18.0007H50.3311V3.67651H52.7803C53.9802 3.67651 54.8862 3.76001 55.4985 3.927C56.117 4.09399 56.6613 4.40942 57.1314 4.87329C57.954 5.67733 58.3652 6.69165 58.3652 7.91626C58.3652 9.22746 57.9261 10.2665 57.0479 11.0334C56.1696 11.8004 54.9852 12.1838 53.4946 12.1838H52.4927ZM52.4927 10.1799H53.2998C55.2852 10.1799 56.2778 9.4161 56.2778 7.88843C56.2778 6.41024 55.2542 5.67114 53.207 5.67114H52.4927V10.1799Z"*/}
                                {/*        fill="var(--primary-color)"*/}
                                {/*    />*/}
                                {/*    <path*/}
                                {/*        d="M63.6367 10.7737C63.6367 8.75741 64.3758 7.02563 65.854 5.57837C67.326 4.1311 69.0949 3.40747 71.1607 3.40747C73.2017 3.40747 74.952 4.13729 76.4116 5.59692C77.8775 7.05656 78.6104 8.80998 78.6104 10.8572C78.6104 12.9167 77.8744 14.664 76.4024 16.0989C74.9242 17.54 73.1398 18.2605 71.0493 18.2605C69.2001 18.2605 67.5394 17.6204 66.0674 16.3401C64.447 14.9237 63.6367 13.0683 63.6367 10.7737ZM65.8169 10.8015C65.8169 12.3848 66.3488 13.6868 67.4126 14.7073C68.4702 15.7278 69.6918 16.238 71.0772 16.238C72.5801 16.238 73.848 15.7185 74.8809 14.6794C75.9138 13.628 76.4302 12.3477 76.4302 10.8386C76.4302 9.31095 75.9199 8.03068 74.8994 6.9978C73.8851 5.95874 72.6296 5.43921 71.1328 5.43921C69.6423 5.43921 68.3836 5.95874 67.357 6.9978C66.3303 8.0245 65.8169 9.2924 65.8169 10.8015Z"*/}
                                {/*        fill="var(--primary-color)"*/}
                                {/*    />*/}
                                {/*    <path d="M87.2495 3.67651V15.969H91.4615V18.0007H85.0879V3.67651H87.2495Z"*/}
                                {/*          fill="var(--primary-color)"/>*/}
                                {/*    <path d="M99.4327 3.67651V15.969H103.645V18.0007H97.271V3.67651H99.4327Z"*/}
                                {/*          fill="var(--primary-color)"/>*/}
                                {/*    <path*/}
                                {/*        d="M108.146 10.7737C108.146 8.75741 108.885 7.02563 110.363 5.57837C111.835 4.1311 113.604 3.40747 115.67 3.40747C117.711 3.40747 119.461 4.13729 120.921 5.59692C122.387 7.05656 123.12 8.80998 123.12 10.8572C123.12 12.9167 122.384 14.664 120.912 16.0989C119.433 17.54 117.649 18.2605 115.559 18.2605C113.709 18.2605 112.049 17.6204 110.577 16.3401C108.956 14.9237 108.146 13.0683 108.146 10.7737ZM110.326 10.8015C110.326 12.3848 110.858 13.6868 111.922 14.7073C112.98 15.7278 114.201 16.238 115.586 16.238C117.089 16.238 118.357 15.7185 119.39 14.6794C120.423 13.628 120.94 12.3477 120.94 10.8386C120.94 9.31095 120.429 8.03068 119.409 6.9978C118.394 5.95874 117.139 5.43921 115.642 5.43921C114.152 5.43921 112.893 5.95874 111.866 6.9978C110.84 8.0245 110.326 9.2924 110.326 10.8015Z"*/}
                                {/*        fill="var(--primary-color)"*/}
                                {/*    />*/}
                                {/*</svg>*/}

                                <img src={`layout/images/logo-k4ndy.png`} style={{height: '40px'}} alt="app-name" />

                            </a>
                        </div>


                    </div>
                </div>
            </div>
        </div>
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
