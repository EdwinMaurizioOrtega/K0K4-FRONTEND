import {Carousel} from "primereact/carousel";
import React, {useEffect, useState} from "react";
import {Galleria} from "primereact/galleria";
import CarouselPosts from "../../service/CarouselPosts";
import {useRouter} from "next/router";
import {getPostsByCity, getPostsByCreator, getPostsBySearch} from "../../actions/posts";
import {useDispatch} from "react-redux";

const HotBanner = () => {

    const router = useRouter();
    const {pathname, query} = router;
    // console.log(router.query);
    const {name} = query;
    const dispatch = useDispatch();


    const history = useRouter();
    //Ejemplo sin utilizar Redux React
    const [postsInCarousel, setProducts, isLoading] = useState([])
    const productService = new CarouselPosts();
    useEffect(() => {


        if (pathname.endsWith('/city')) {
            // dispatch(getPostsByCity(name));
            productService.getCarouselPostByCity(name).then(data => setProducts(data.slice(0, 9)));
            // console.log("hola hola");
        } else {
            productService.getProductsSmall().then(data => setProducts(data.slice(0, 9)));

        }


    }, [name]); // eslint-disable-line react-hooks/exhaustive-deps

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
        history.push(`/apps/blog/detail?id=${e._id}`);
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
                                  onClick={() => openInNewTab('https://wa.me/593' + postsInCarousel.cellphone + '?text=' + postsInCarousel.title)}>WhatsApp
                            </span>
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
                    )

            }
        </>
    )

}

export default HotBanner;
