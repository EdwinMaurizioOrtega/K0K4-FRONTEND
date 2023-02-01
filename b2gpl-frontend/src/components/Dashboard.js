import React, {useState, useRef, useEffect} from 'react';

import {Divider} from 'primereact/divider';

import {Button} from 'primereact/button';
import {Chart} from 'primereact/chart';
import {Dropdown} from 'primereact/dropdown';
import {ProgressBar} from 'primereact/progressbar';
import {Avatar} from 'primereact/avatar';
import {Badge} from 'primereact/badge';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import {Carousel} from 'primereact/carousel';
import {Timeline} from 'primereact/timeline';
import CustomerService from '../service/CustomerService';

import {ListBox} from "primereact/listbox";

import {useDispatch} from 'react-redux';
import {useNavigate, useLocation} from 'react-router-dom';
import {getPostsBySearch} from '../actions/posts';
import Posts from '../components/Posts/Posts';
import Form from '../components/Form/Form';
import Pagination from './Pagination';
import {InputText} from 'primereact/inputtext';


import ProductService from '../service/ProductService';
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

    const [products, setProducts] = useState([]);
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

    const productService = new ProductService();

    useEffect(() => {
        productService.getProductsSmall().then(data => setProducts(data.slice(0,9)));
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

    const productTemplate = (product) => {
        return (
            <div className="product-item">
                <div className="product-item-content">
                    <div className="mb-3" onClick={() => openPost(product)}>
                        {/*<img src={`images/product/${product.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={product.name} className="product-image" />*/}
                        <Galleria value={product.selectedFile.map((pic) => (pic))} responsiveOptions={galleriaResponsiveOptions} numVisible={7} circular style={{maxWidth: '800px', margin: 'auto'}} item={galleriaItemTemplate} autoPlay transitionInterval={2000} showThumbnails={false} showIndicators ></Galleria>

                    </div>
                    <div>
                        <h4 className="mb-1">{product.title}</h4>
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
        <div>

            <div className="card">

                <Carousel value={products} numVisible={4} numScroll={1} responsiveOptions={responsiveOptions}
                          autoplayInterval={3000} itemTemplate={productTemplate} header={<h5>Model VIP K4ndy</h5>} />

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
