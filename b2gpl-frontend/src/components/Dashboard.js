import React, {useState, useRef, useEffect} from 'react';
import {Carousel} from 'primereact/carousel';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigate, useLocation} from 'react-router-dom';
import {getPostsBySearch, getPostsInCarousel} from '../actions/posts';
import Posts from '../components/Posts/Posts';
import Pagination from './Pagination';

import {Galleria} from "primereact/galleria";

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

const Dashboard = () => {

    const query = useQuery();
    const page = query.get('page') || 1;
    const searchQuery = query.get('searchQuery');

    const [currentId, setCurrentId] = useState(0);
    const dispatch = useDispatch();

    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const history = useNavigate();

    const searchPost = () => {
        if (search.trim() || tags) {
            dispatch(getPostsBySearch({search, tags: tags.join(',')}));
            history(`/posts/search?searchQuery=${search || 'none'}&tags=${tags.join(',')}`);
        } else {
            history('/');
        }
    };

    const handleKeyPress = (e) => {
        if (e.keyCode === 13) {
            searchPost();
        }
    };

    const handleAddChip = (tag) => setTags([...tags, tag]);

    const handleDeleteChip = (chipToDelete) => setTags(tags.filter((tag) => tag !== chipToDelete));


    // Demo Ejemplo
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

    const {posts, isLoading} = useSelector((state) => state.posts);
    console.log("1 "+posts);

    useEffect(() => {
        dispatch(getPostsInCarousel());

    }, []); // eslint-disable-line react-hooks/exhaustive-deps


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
        // dispatch(getPost(post._id, history));
        console.log(e._id);
        history(`/posts/${e._id}`);
    };

    //Número de teléfono WhatsApp
    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const productTemplate = (posts) => {
        return (
            <div className="product-item">
                <div className="product-item-content">
                    <div className="mb-3" onClick={() => openPost(posts)}>
                        {/*<img src={`images/product/${product.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={product.name} className="product-image" />*/}
                        <Galleria value={posts.selectedFile.map((pic) => (pic))} responsiveOptions={galleriaResponsiveOptions} numVisible={7} circular style={{maxWidth: '800px', margin: 'auto'}} item={galleriaItemTemplate} autoPlay transitionInterval={2000} showThumbnails={false}
                                  showIndicators></Galleria>

                    </div>
                    <div>
                        {/*<h4 className="mb-1">{posts.title}</h4>*/}
                        <span className="inline-flex align-items-center py-2 px-3 font-medium border-1 surface-border border-round" >
                        <i className="pi pi-whatsapp mr-2"></i>
                        <span className="font-semibold" onClick={() => openInNewTab('https://wa.me/593' + posts.cellphone + '?text='+posts.title)}>WhatsApp</span>
                    </span>
                        <div className="text-900 font-semibold text-xl mb-3">{posts.title}</div>
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

    //Image ok site
    //https://gelbooru.com/index.php?page=post&s=view&id=687839

    return (
        <div>

            <div className="card">

                {
                isLoading ?
                    <img src={`assets/layout/images/5db61a9d71fa2c97ffff30c83dcaa6e5.gif`} style={{
                        height: '100%',
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "50%"}}  />
                    : (
                <Carousel value={posts} numVisible={4} numScroll={1} responsiveOptions={responsiveOptions}
                          autoplayInterval={3000} itemTemplate={productTemplate} header={<h5 style={{textAlign: "center"}}>🍭K4NDY ♥️ 🍑PARÁ CUMPLIR 🔥😈🍑TUS FANTASÍAS 🍭💯🍓</h5>}/>
)}
            </div>

            <div className="card">


                {/*<InputText onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search Memories"  value={search} onChange={(e) => setSearch(e.target.value)} />*/}
                {/* <ChipInput

                  value={tags}
                  onAdd={(chip) => handleAddChip(chip)}
                  onDelete={(chip) => handleDeleteChip(chip)}
                  label="Search Tags"
                  variant="outlined"
                /> */}
                {/*<Button onClick={searchPost}  variant="contained" color="primary">Search</Button>*/}


                <Posts setCurrentId={setCurrentId}/>
                {(!searchQuery && !tags.length) && (
                    <div className="card">
                        <Pagination page={page}/>
                    </div>
                )}

                {/* <Grid item xs={12} sm={6} md={3}>
              <AppBar className={classes.appBarSearch} position="static" color="inherit">
                <TextField onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search Memories" fullWidth value={search} onChange={(e) => setSearch(e.target.value)} />
                <ChipInput
                  style={{ margin: '10px 0' }}
                  value={tags}
                  onAdd={(chip) => handleAddChip(chip)}
                  onDelete={(chip) => handleDeleteChip(chip)}
                  label="Search Tags"
                  variant="outlined"
                />
                <Button onClick={searchPost} className={classes.searchButton} variant="contained" color="primary">Search</Button>
              </AppBar>
              <Form currentId={currentId} setCurrentId={setCurrentId} />
              {(!searchQuery && !tags.length) && (
                <Paper className={classes.pagination} elevation={6}>
                  <Pagination page={page} />
                </Paper>
              )}
            </Grid> */}

                {/*<Form currentId={currentId} setCurrentId={setCurrentId} />*/}

            </div>

        </div>

    );
};

export default Dashboard;
