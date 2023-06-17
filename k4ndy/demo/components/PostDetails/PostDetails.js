import React, {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import {getPost, getPostsBySearch} from '../../actions/posts';

import {Divider} from 'primereact/divider';
import {Image} from 'primereact/image';
import {useParams} from "next/navigation";
import {Router, useRouter} from "next/router";
import {PhotoService} from "../../service/PhotoService";
import Link from "next/link";
import Head from "next/head";

const PostDetails = () => {

    const {post, posts, isLoading} = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const history = useRouter();
    //const {id} = useParams();
    const {id} = history.query;
    // const galleriaService = new PhotoService();
    const [images, setImages] = useState(null);

    useEffect(() => {
        dispatch(getPost(id));
    }, [id]);

    useEffect(() => {
        if (post) {
            dispatch(getPostsBySearch({search: 'none', tags: post?.tags.join(',')}));
        }
    }, [post]);

    // useEffect(() => {
    //     galleriaService.getImages().then(data => setImages(data));
    // }, []);


    if (!post) return null;

    const openPost = (_id) => history.push(`/posts/${_id}`);

    if (isLoading) {
        return (
            <img src={`../../../layout/images/5db61a9d71fa2c97ffff30c83dcaa6e5.gif`} style={{
                height: '100%',
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                width: "50%"}}  />
        );
    }

    const recommendedPosts = posts.filter(({_id}) => _id !== post._id);
    // console.log("posts: "+posts);
    // console.log("recommendedPosts: "+recommendedPosts);

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };
    return (
        <>
        <Head>
            <title>{post.title}</title>
        </Head>
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
                    <span className="text-900" onClick={() => openInNewTab(`https://wa.me/593${post.cellphone}?text=Hola, acabo de ver tu anuncio en K4ndy, "${post.title.substring(0, 25)}(…)", y me gustaría quedar contigo.`)}>WhatsApp</span>
                </span>
                    </div>
                </div>
                <div className="flex flex-column align-items-center justify-content-center">
                    {/* <img className="w-4rem h-4rem" src={`/demo/images/avatar/circle/avatar-f-2@2x.png`} alt="Avatar" /> */}
                    {/*<span className="mt-3 font-bold text-900 text-center white-space-nowrap">{post.name}</span>*/}
                    <Link href={`/apps/blog/city?name=${post.city}`} className="mt-3 font-bold text-900 text-center white-space-nowrap">
                        {` ${post.city}`}
                    </Link>
                    <Link href={`/apps/blog/creator?name=${post.name}`} className="mt-3 font-bold text-900 text-center white-space-nowrap">
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

            {/*{!!recommendedPosts.length && (*/}
            {/*    <div>*/}
            {/*        <span>You might also like:</span>*/}
            {/*        <Divider/>*/}
            {/*        <div>*/}
            {/*            {recommendedPosts.map(({title, name, message, likes, selectedFile, _id}) => (*/}
            {/*                <div style={{margin: '20px', cursor: 'pointer'}} onClick={() => openPost(_id)} key={_id}>*/}
            {/*                    <span>{title}</span>*/}
            {/*                    <span>{name}</span>*/}
            {/*                    <span>{message}</span>*/}
            {/*                    <span>Likes: {likes.length}</span>*/}
            {/*                    <img src={selectedFile[0]} width="200px"/>*/}
            {/*                </div>*/}
            {/*            ))}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*)}*/}
        </div>
        </>
    );
};

export default PostDetails;
