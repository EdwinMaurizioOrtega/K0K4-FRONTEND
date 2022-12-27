import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getPost, getPostsBySearch } from '../../actions/posts';
import { Button } from 'primereact/button';

const PostDetails = () => {
  
  console.log("En el detalle del producto.");

  // const contextPath = getConfig().publicRuntimeConfig.contextPath;

  const { post, posts, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const history = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPost(id));
  }, [id]);

  useEffect(() => {
    if (post) {
      dispatch(getPostsBySearch({ search: 'none', tags: post?.tags.join(',') }));
    }
  }, [post]);

  if (!post) return null;

  const openPost = (_id) => history(`/posts/${_id}`);

  if (isLoading) {
    return (
      <ProgressSpinner />
    );
  }

  const recommendedPosts = posts.filter(({ _id }) => _id !== post._id);
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
                    <i className="pi pi-comments text-primary mr-2"></i>
                    <span className="text-900">....</span>
                </span>
                <span className="inline-flex align-items-center py-2 px-3 font-medium border-1 surface-border border-round">
                    <i className="pi pi-eye text-primary mr-2"></i>
                    <span className="text-900">.....</span>
                </span>
            </div>
        </div>
        <div className="flex flex-column align-items-center justify-content-center">
            {/* <img className="w-4rem h-4rem" src={`${contextPath}/demo/images/avatar/circle/avatar-f-2@2x.png`} alt="Avatar" /> */}
            <span className="mt-3 font-bold text-900 text-center white-space-nowrap">{post.name}</span>
        </div>
    </div>
    <div className="text-center my-6">
        <img src={post.selectedFile || 'https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png'} alt="Image" className="w-full" />
    </div>
    <div className="text-2xl text-900 mb-4 font-semibold">Sodales massa, morbi convallis</div>
    <p className="line-height-3 text-lg mb-4">
    {post.message}
    </p>


    <div className="flex flex-column sm:flex-row my-8 w-full gap-3">
        <Button icon="pi pi-twitter" className="p-button-secondary" label="Twitter"></Button>
        <Button icon="pi pi-facebook" className="p-button-secondary" label="Facebook"></Button>
        <Button onClick={() => history('/apps/blog/edit')} icon="pi pi-pencil" className="sm:ml-auto" label="Edit Post"></Button>
    </div>

   
</div>
  );
};

export default PostDetails;
