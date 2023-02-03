import React from 'react';
import { useSelector } from 'react-redux';
import { ProgressSpinner } from 'primereact/progressspinner';

import Post from './Post/Post';

const Posts = ({ setCurrentId }) => {
  const { posts, isLoading } = useSelector((state) => state.posts);

  if (!posts.length && !isLoading) return 'No se ha encontrado publicaciones.';

  return (
    isLoading ?
        <img src={`assets/layout/images/5db61a9d71fa2c97ffff30c83dcaa6e5.gif`} style={{
            height: '100%',
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            width: "50%"}}  />
        : (
      <div className="p-fluid grid formgrid">
        {posts?.map((post) => (
          <div key={post._id} className="field col-12 md:col-4" >
            <Post post={post} setCurrentId={setCurrentId} />
          </div>
        ))}
      </div>
    )
  );
};

export default Posts;
