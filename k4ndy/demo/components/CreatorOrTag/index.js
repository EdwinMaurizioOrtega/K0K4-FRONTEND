import React, {useEffect} from 'react';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {Divider} from 'primereact/divider';
import {ProgressSpinner} from 'primereact/progressspinner';

import Post from '../Posts/Post/Post';
import {getPostsByCity, getPostsByCreator, getPostsBySearch} from '../../actions/posts';

const CreatorOrTag = () => {
    const router = useRouter();
    const {pathname, query} = router;
    // console.log(router.query);
    const {name} = query;

    const dispatch = useDispatch();
    const {posts, isLoading} = useSelector((state) => state.posts);

    useEffect(() => {

        // console.log(name);
        // console.log(pathname);

        if (pathname.endsWith('/city')) {
            dispatch(getPostsByCity(name));
        } else if (pathname.endsWith('/tag')) {
            dispatch(getPostsBySearch({ tags: name }));
        } else {
            dispatch(getPostsByCreator(name));
        }
    }, [name]);

    if (!posts.length && !isLoading) {
        return 'No se encontró ninguna publicación.';
    }

    return (
        <div>
            <h4 style={{textAlign: 'center'}}>🍭💯🍑Anuncios de {name}</h4>
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
