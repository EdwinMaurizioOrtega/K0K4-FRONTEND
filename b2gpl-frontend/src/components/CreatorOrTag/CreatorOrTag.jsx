import React, {useEffect} from 'react';
import {useParams, useLocation} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {Divider} from 'primereact/divider';
import {ProgressSpinner} from 'primereact/progressspinner';


import Post from '../Posts/Post/Post';
import {getPostsByCity, getPostsByCreator, getPostsBySearch} from '../../actions/posts';

const CreatorOrTag = () => {
    const {name} = useParams();
    const dispatch = useDispatch();
    const {posts, isLoading} = useSelector((state) => state.posts);

    const location = useLocation();

    useEffect(() => {

        if (location.pathname.startsWith('/cities')) {
            dispatch(getPostsByCity(name));
        }

        if (location.pathname.startsWith('/tags')) {
            dispatch(getPostsBySearch({tags: name}));
        } else {
            dispatch(getPostsByCreator(name));
        }
    }, []);

    if (!posts.length && !isLoading) return 'No posts';

    return (
        <div>
            <span variant="h2">{name}</span>
            <Divider/>
            {isLoading ? <ProgressSpinner/> : (
                <div className="p-fluid grid formgrid">
                    {posts?.map((post) => (
                        <div key={post._id} className="field col-12 md:col-4">
                            <Post post={post}/>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CreatorOrTag;
