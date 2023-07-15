import React from "react";
import AppConfig from "../../../../layout/AppConfig";
import {useRouter} from "next/router";
import CustomHeader from "../../../../demo/components/UserHeader/CustomHeader";
import PostDetails from "../../../../demo/components/PostDetails/PostDetails";

const IndexPageAnuncio = () => {

    // const router = useRouter();
    // const { anuncio } = router.query;

    return (
        <div className="landing-wrapper">
            <CustomHeader/>
            <PostDetails/>
        </div>
    );
};

IndexPageAnuncio.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig minimal/>
        </React.Fragment>
    );
};
export default IndexPageAnuncio;
