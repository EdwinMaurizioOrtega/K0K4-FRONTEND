import React from 'react';
import PostDetails from "../../../../demo/components/PostDetails/PostDetails";
import AppConfig from "../../../../layout/AppConfig";
import CustomHeader from "../../../../demo/components/UserHeader/CustomHeader";

function BlogDetail() {

    return (
        <div className="landing-wrapper">
            <CustomHeader/>
            <PostDetails/>
        </div>
    );
}

BlogDetail.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig minimal />
        </React.Fragment>
    );
};

export default BlogDetail;
