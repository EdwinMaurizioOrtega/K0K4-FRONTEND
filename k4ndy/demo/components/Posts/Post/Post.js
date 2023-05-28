import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import 'moment/locale/es'
import {likePost, deletePost} from '../../../actions/posts';
import {Button} from 'primereact/button';
import {Galleria} from 'primereact/galleria';
import {useRouter} from "next/router";
import Link from "next/link";

const Post = ({post, setCurrentId}) => {

    const history = useRouter();
    moment.locale('es')
    const user = JSON.parse(localStorage.getItem('profile'));
    //console.log(user);
    const [likes, setLikes] = useState(post?.likes);
    const dispatch = useDispatch();
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

    const userId = user?.result?._id;
    const hasLikedPost = post.likes.find((like) => like === userId);

    const handleLike = async () => {
        dispatch(likePost(post._id));

        if (hasLikedPost) {
            setLikes(post.likes.filter((id) => id !== userId));
        } else {
            setLikes([...post.likes, userId]);
        }
    };

    const Likes = () => {
        if (likes.length > 0) {
            return likes.find((like) => like === userId) ? (
                <>
                    <span fontSize="small"/>
                    &nbsp;{likes.length > 2 ? `You and ${likes.length - 1} others` : `${likes.length} like${likes.length > 1 ? 's' : ''}`}
                </>
            ) : (
                <>
                    <span fontSize="small"/>
                    &nbsp;{likes.length} {likes.length === 1 ? 'Like' : 'Likes'}
                </>
            );
        }

        return (
            <>
                <span fontSize="small"/>
                &nbsp;Like
            </>
        );
    };

    const openPost = (e) => {
        // dispatch(getPost(post._id, history));
        history.push(`/apps/blog/detail?id=${post._id}`);
    };

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const galleriaItemTemplate = (item) => {
        return <img src={item} style={{width: '100%', display: 'block'}}/>
    }

    return (
        <div key={post._id} className="p-3">
            <div className="relative" onClick={openPost}>
                <Galleria value={post.selectedFile.map((pic) => (pic))} responsiveOptions={galleriaResponsiveOptions}
                          numVisible={7} circular style={{maxWidth: '800px', margin: 'auto'}}
                          item={galleriaItemTemplate} autoPlay transitionInterval={2000} showThumbnails={false}
                          showIndicators></Galleria>
            </div>
            <div className="p-3">
                <p className="text-700 text-lg mt-0 mb-5">
                </p>

                <span className="flex align-items-center text-900">
                        <i className="pi pi-clock mr-2"></i>
                        <span className="font-semibold">{moment(post.createdAt).fromNow()}</span>
                </span>

                <div className="text-900 font-semibold text-xl mb-3">{post.title}</div>

                <Link href={`/apps/blog/city?name=${post.city}`} className="mt-3 font-bold text-900 text-center white-space-nowrap">
                    {` ${post.city}`}
                </Link>
                <p className="text-700 text-lg mt-0 mb-5">{post.message.split(' ').splice(0, 20).join(' ')}...</p>

                <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                    <span
                        className="inline-flex align-items-center py-2 px-3 font-medium border-1 surface-border border-round">
                        <i className="pi pi-phone mr-2"></i>
                        <span className="font-semibold"
                              onClick={() => openInNewTab('tel:0' + post.cellphone)}>Llámame</span>
                    </span>
                    <span
                        className="inline-flex align-items-center py-2 px-3 font-medium border-1 surface-border border-round">
                        <i className="pi pi-whatsapp mr-2"></i>
                        <span className="font-semibold"
                              onClick={() => openInNewTab('https://wa.me/593' + post.cellphone + '?text=' + post.title)}>WhatsApp</span>
                    </span>
                    <span className="flex align-items-center text-900">
                        <Button icon="pi pi-fw pi-thumbs-up-fill"
                                className="inline-flex align-items-center py-2 px-3 font-medium border-1 surface-border border-round"
                                disabled={!user?.result} onClick={handleLike}>
                            <Likes/>
                        </Button>
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 align-items-center justify-content-between">


                    <span className="flex align-items-center text-900">
                        {user?.result?._id === post?.creator && (
                            <Button icon="pi pi-fw pi-trash" className="p-button-rounded p-button-secondary"
                                    onClick={() => dispatch(deletePost(post._id))}>
                                &nbsp; Borrar
                            </Button>
                        )}
                    </span>
                    {/*<span className="flex align-items-center text-900">*/}
                    {/*    {( user?.result?._id === post?.creator) && (*/}

                    {/*            <Button*/}
                    {/*                onClick={(e) => {*/}
                    {/*                    e.stopPropagation();*/}
                    {/*                    setCurrentId(post._id);*/}
                    {/*                }}*/}
                    {/*                className="p-button-rounded p-button-secondary"*/}

                    {/*                icon="pi pi-fw pi-pencil"*/}
                    {/*            >*/}
                    {/*               Editar*/}
                    {/*            </Button>*/}

                    {/*    )}*/}
                    {/*</span>*/}
                </div>
            </div>
        </div>
    );
};

export default Post;
