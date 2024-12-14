import React from "react";
import AppConfig from "../../../layout/AppConfig";
import UIAnuncios from "../../../demo/components/UIAnuncios";

const IndexPageCiudad = () => {
    return (
        <>
            <UIAnuncios/>
        </>
    );
};

IndexPageCiudad.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig minimal/>
        </React.Fragment>
    );
};
export default IndexPageCiudad;
