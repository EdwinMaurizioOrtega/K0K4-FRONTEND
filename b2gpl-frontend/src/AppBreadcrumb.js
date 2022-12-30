import React, {useState} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {classNames} from 'primereact/utils';
import {BreadCrumb} from 'primereact/breadcrumb';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {getPostsBySearch} from '../src/actions/posts'
import {useDispatch} from 'react-redux';

const AppBreadcrumb = (props) => {

    const [search, setSearch] = useState('');
    const [tags, setTags] = useState([]);
    const location = useLocation();
    const history = useNavigate;
    const dispatch = useDispatch();

    const activeRoute = props.routes.filter((route) => {
        return route.label.replace(/\s/g, '').toLowerCase() === location.pathname.toLowerCase().replace(/\s/g, '').slice(1);
    });

    let items;

    if (location.pathname === '/') {
        items = [{label: 'Posts'}, {label: 'Posts'}];
    } else if (!activeRoute.length) {
        items = [{label: ''}, {label: ''}];
    } else {
        items = [{label: activeRoute[0].parent}, {label: activeRoute[0].label}];
    }

    const isStatic = () => {
        return props.menuMode === 'static';
    };

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

    return (
        <div className="layout-breadcrumb-container">
            <div className="layout-breadcrumb-left-items">
                {isStatic() && (
                    <button className="menu-button p-link" onClick={props.onMenuButtonClick}>
                        <i className="pi pi-bars"></i>
                    </button>
                )}

                <BreadCrumb model={items} className="layout-breadcrumb"/>
            </div>
            <div className="layout-breadcrumb-right-items">
                {/*<button tabIndex="0" className="search-icon p-link" onClick={props.breadcrumbClick}>*/}
                {/*    <i className="pi pi-search"></i>*/}
                {/*</button>*/}

                <div>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search"></i>
                        {/*<InputText placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onClick={props.onInputClick} />*/}
                        <InputText placeholder="Buscar..." onKeyDown={handleKeyPress} name="search" variant="outlined" label="Search Memories" value={search} onChange={(e) => setSearch(e.target.value)}/>

                    </span>
                </div>

                    {/*<span className="layout-rightmenu-button-desktop">*/}
                    {/*<Button icon="pi pi-bookmark" className="layout-rightmenu-button" onClick={props.onRightMenuButtonClick}>*/}
                    {/*   */}
                    {/*</Button>*/}
                    {/*</span>*/}

                    {/*<span className="layout-rightmenu-button-mobile">*/}
                    {/*<Button icon="pi pi-bookmark" className="layout-rightmenu-button" onClick={props.onRightMenuButtonClick}></Button>*/}
                    {/*</span>*/}

            </div>
        </div>
    );
};

export default AppBreadcrumb;
