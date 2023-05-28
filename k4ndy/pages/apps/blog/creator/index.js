import React from "react";
import AppConfig from "../../../../layout/AppConfig";
import CustomHeader from "../../../../demo/components/UserHeader/CustomHeader";
import CreatorOrTag from "../../../../demo/components/CreatorOrTag/CreatorOrTag";

function Creator (){


    return (
        <div className="landing-wrapper">
            <CustomHeader/>
            <CreatorOrTag/>
        </div>
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
