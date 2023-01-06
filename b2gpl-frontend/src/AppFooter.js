import React from 'react';

const AppFooter = (props) => {
    return (
        <div className="layout-footer">
            <div className="footer-logo-container">
                <img id="footer-logo" src={`assets/layout/images/logo-${props.colorScheme === 'light' ? 'dark' : 'light'}.png`} alt="atlantis-layout" />
                <span className="app-name">1KNDY</span>
            </div>
            <span className="copyright">&#169; B2|GPL - 2023</span>
        </div>
    );
};

export default AppFooter;
