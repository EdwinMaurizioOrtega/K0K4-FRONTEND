import React from "react";
import AppConfig from "../../../../layout/AppConfig";
import CustomHeader from "../../../../demo/components/UserHeader/CustomHeader";
import CreatorOrTag from "../../../../demo/components/CreatorOrTag";
import Head from "next/head";

function Creator (){


    return (
        <>
            <Head>
                <title>Creador</title>
            </Head>
            <div className="landing-wrapper">
                <CustomHeader/>
                <CreatorOrTag/>
            </div>
        </>

    );

}


Creator.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig minimal />
        </React.Fragment>
    );
};

export default Creator;
