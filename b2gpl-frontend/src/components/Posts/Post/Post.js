import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import moment from 'moment';
import {useNavigate, Link} from 'react-router-dom';

import {likePost, deletePost} from '../../../actions/posts';

import {Button} from 'primereact/button';

const Post = ({post, setCurrentId}) => {
    const user = JSON.parse(localStorage.getItem('profile'));
    const [likes, setLikes] = useState(post?.likes);
    const dispatch = useDispatch();
    const history = useNavigate();

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

        history(`/posts/${post._id}`);
    };

    const openInNewTab = url => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div key={post._id} className="p-3">
            <div className="relative">
                <img src={post.selectedFile[0] || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} className="w-full" title={post.title} onClick={openPost}/>
                {/* <img src={contextPath + blog.profile} className="flex absolute w-4rem h-4rem" style={{ bottom: '-1.5rem', right: '1.5rem' }} alt={blog.description.split(' ', 1)} /> */}
            </div>
            <div className="p-3">
                <p className="text-700 text-lg mt-0 mb-5">
                    {post.tags.map((tag) => (
                        <Link to={`/tags/${tag}`} style={{textDecoration: 'none', color: '#3f51b5'}}>
                            {` #${tag} `}
                        </Link>
                    ))}
                </p>

                <span className="flex align-items-center text-900">
                        <Button icon="pi pi-fw pi-thumbs-up-fill" className="p-button-rounded p-button-secondary" disabled={!user?.result} onClick={handleLike}>
                            <Likes/>
                        </Button>
                    </span>

                <div className="text-900 font-semibold text-xl mb-3">{post.title}</div>
                <p className="text-700 text-lg mt-0 mb-5">{post.message.split(' ').splice(0, 20).join(' ')}...</p>

                <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
                    <span className="flex align-items-center text-900" href={'tel:'+ post.cellphone}>
                        <i className="pi pi-phone mr-2"></i>
                        <span className="font-semibold">Llámame</span>
                    </span>
                    <span className="flex align-items-center text-900" onClick={() => openInNewTab('http://web.whatsapp.com/send?phone=+593'+post.cellphone)}>
                        <i className="pi pi-whatsapp mr-2"></i>
                        <span className="font-semibold">Whatsapp</span>
                    </span>
                    <span className="flex align-items-center text-900">
                        <i className="pi pi-clock mr-2"></i>
                        {/* <span className="font-semibold mr-1">{moment(post.createdAt).fromNow()}</span> */}
                        <span className="font-semibold">{moment(post.createdAt).fromNow()}</span>
                    </span>
                </div>

                <div className="flex flex-wrap gap-2 align-items-center justify-content-between">


                    <span className="flex align-items-center text-900">
                        {user?.result?._id === post?.creator && (
                            <Button icon="pi pi-fw pi-trash" className="p-button-rounded p-button-secondary" onClick={() => dispatch(deletePost(post._id))}>
                                &nbsp; Delete
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
