import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {useParams, useNavigate, Link} from 'react-router-dom';
import {ProgressSpinner} from 'primereact/progressspinner';
import {getPost, getPostsBySearch} from '../../actions/posts';
import {Button} from 'primereact/button';
import {Galleria} from 'primereact/galleria';
import PhotoService from "../../service/PhotoService";
import {Divider} from 'primereact/divider';
import {Image} from 'primereact/image';


const PostDetails = () => {

    // const contextPath = getConfig().publicRuntimeConfig.contextPath;

    const {post, posts, isLoading} = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const history = useNavigate();
    const {id} = useParams();

    const [activeIndex, setActiveIndex] = useState(0);
    const galleriaService = new PhotoService();

    const galleria3 = useRef(null);
    const [images, setImages] = useState(null);


    useEffect(() => {
        dispatch(getPost(id));
    }, [id]);

    useEffect(() => {
        if (post) {
            dispatch(getPostsBySearch({search: 'none', tags: post?.tags.join(',')}));
        }
    }, [post]);

    useEffect(() => {
        galleriaService.getImages().then(data => setImages(data));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps


    if (!post) return null;

    const openPost = (_id) => history(`/posts/${_id}`);

    if (isLoading) {
        return (
            <ProgressSpinner/>
        );
    }

    const recommendedPosts = posts.filter(({_id}) => _id !== post._id);

    const responsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
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


    const itemTemplate = (item) => {
        return <img src={item.itemImageSrc} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={item.alt} style={{width: '100%', display: 'block'}}/>;
    }

    const thumbnailTemplate = (item) => {
        return <img src={item.thumbnailImageSrc} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={item.alt} style={{display: 'block'}}/>;
    }

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    return (
        <div className="card">
            <div className="flex justify-content-between flex-column-reverse md:flex-row align-items-center">
                <div>
                    <div className="text-xl text-900 mb-4 mt-4 md:mt-0 text-center md:text-left font-semibold md:pr-4">{post.title}</div>
                    <div className="flex flex-wrap justify-content-center md:justify-content-start gap-3">
                <span className="inline-flex align-items-center py-2 px-3 font-medium border-1 surface-border border-round">
                    <i className="pi pi-clock text-primary mr-2"></i>
                    <span className="text-900">{moment(post.createdAt).fromNow()}</span>
                </span>
                        <span className="inline-flex align-items-center py-2 px-3 font-medium border-1 surface-border border-round">
                    <i className="pi pi-phone text-primary mr-2"></i>
                    <span className="text-900" onClick={() => openInNewTab('tel:0' + post.cellphone)}>Llámame</span>
                </span>
                        <span className="inline-flex align-items-center py-2 px-3 font-medium border-1 surface-border border-round">
                    <i className="pi pi-whatsapp text-primary mr-2"></i>
                    <span className="text-900" onClick={() => openInNewTab('https://wa.me/593' + post.cellphone + '?text=' + post.title)}>WhatsApp</span>
                </span>
                    </div>
                </div>
                <div className="flex flex-column align-items-center justify-content-center">
                    {/* <img className="w-4rem h-4rem" src={`${contextPath}/demo/images/avatar/circle/avatar-f-2@2x.png`} alt="Avatar" /> */}
                    {/*<span className="mt-3 font-bold text-900 text-center white-space-nowrap">{post.name}</span>*/}

                    <Link to={`/creators/${post.name}`} className="mt-3 font-bold text-900 text-center white-space-nowrap">
                        {` ${post.name}`}
                    </Link>
                </div>
            </div>

            <div className="text-2xl text-900 mb-4 font-semibold">{post.title}</div>
            <p className="line-height-3 text-lg mb-4">
                {post.message}
            </p>


            {/*<div className="flex flex-column sm:flex-row my-8 w-full gap-3">*/}
            {/*<Button icon="pi pi-twitter" className="p-button-secondary" label="Twitter"></Button>*/}
            {/*<Button icon="pi pi-facebook" className="p-button-secondary" label="Facebook"></Button>*/}
            {/*<Button onClick={() => history('/apps/blog/edit')} icon="pi pi-pencil" className="sm:ml-auto" label="Edit Post"></Button>*/}
            {/*</div>*/}

            {/*<img src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt="Image" className="w-full"/>*/}
            {/*<Galleria ref={galleria3} value={images} responsiveOptions={responsiveOptions} numVisible={7} style={{ maxWidth: '850px' }}*/}
            {/*          activeIndex={activeIndex} onItemChange={(e) => setActiveIndex(e.index)}*/}
            {/*          circular fullScreen showItemNavigators showThumbnails={false} item={itemTemplate} thumbnail={thumbnailTemplate} />*/}

            <div className="p-fluid grid formgrid">
                {
                    post.selectedFile.map((picture, index) => {
                        let imgEl = <Image src={picture} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}
                                           width="100%" preview/>

                        return (
                            <div className="field col-12 md:col-4" key={index}>
                                {imgEl}
                            </div>
                        )
                    })
                }
            </div>

            {!!recommendedPosts.length && (
                <div>
                    <span>You might also like:</span>
                    <Divider/>
                    <div>
                        {recommendedPosts.map(({title, name, message, likes, selectedFile, _id}) => (
                            <div style={{margin: '20px', cursor: 'pointer'}} onClick={() => openPost(_id)} key={_id}>
                                <span>{title}</span>
                                <span>{name}</span>
                                <span>{message}</span>
                                <span>Likes: {likes.length}</span>
                                <img src={selectedFile[0]} width="200px"/>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostDetails;
