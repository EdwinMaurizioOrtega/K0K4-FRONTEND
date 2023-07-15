import React from 'react';
import AppConfig from '../../layout/AppConfig';
import UIAnuncios from "../../demo/components/UIAnuncios";

function LandingPage() {
    return (
        <>
            <UIAnuncios/>
        </>
    );
}

LandingPage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig minimal/>
        </React.Fragment>
    );
};

export default LandingPage;

