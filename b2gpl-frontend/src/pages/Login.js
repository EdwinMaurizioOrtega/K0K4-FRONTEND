import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// import { GoogleLogin } from 'react-google-login';
import { signin, signup } from '../actions/auth';
import { AUTH } from '../constants/actionTypes';

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

export const Login = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(false);
    const dispatch = useDispatch();
    const history = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const handleShowPassword = () => setShowPassword(!showPassword);

    const switchMode = () => {
        setForm(initialState);
        setIsSignup((prevIsSignup) => !prevIsSignup);
        setShowPassword(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isSignup) {
            dispatch(signup(form, history));
        } else {
          console.log(form);
            dispatch(signin(form, history));
        }
    };

    const googleSuccess = async (res) => {
        const result = res?.profileObj;
        const token = res?.tokenId;

        try {
            dispatch({ type: AUTH, data: { result, token } });

            history('/');
        } catch (error) {
            console.log(error);
        }
    };

    const googleError = () => console.log('Google Sign In was unsuccessful. Try again later');

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    return (
        <div className="login-body">
            {/*<div className="login-image">*/}
            {/*    <img src={`assets/layout/images/pages/login-${props.colorScheme === 'light' ? 'ondark' : 'onlight'}.png`} alt="atlantis" />*/}
            {/*</div>*/}
            <div className="login-panel p-fluid">
                <div className="flex flex-column">
                    <div className="flex align-items-center mb-6 logo-container">
                        <img src={`assets/layout/images/logo-dark.png`} className="login-logo" alt="login-logo" />
                        <img src={`assets/layout/images/appname-dark.png`} className="login-appname" alt="login-appname" />
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-container">
                            {isSignup && (
                                <>
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-envelope"></i>
                                        <InputText type="text" name="firstName" placeholder="First Name" onChange={handleChange} />
                                    </span>
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-key"></i>
                                        <InputText type="text" placeholder="Last Name" name="lastName" onChange={handleChange} />
                                    </span>
                                </>
                            )}

                            <span className="p-input-icon-left">
                                <i className="pi pi-envelope"></i>
                                <InputText type="text" name="email" placeholder="Email" onChange={handleChange} />
                            </span>
                            <span className="p-input-icon-left">
                                <i className="pi pi-key"></i>
                                <InputText  placeholder="Password" name="password" onChange={handleChange} />
                            </span>

                            {isSignup && <InputText name="confirmPassword" placeholder="Repeat Password" onChange={handleChange}  />}

                            <button className="flex p-link">Forgot your password?</button>
                        </div>
                        <div className="button-container">
                            <Button type="submit">{isSignup ? 'Sign Up' : 'Sign In'}</Button>
                            <span>
                                Don’t have an account?
                                <button className="p-link" onClick={switchMode}>
                                    {isSignup ? 'Sign in' : 'Sign Up'}
                                </button>
                            </span>
                        </div>
                    </form>
                </div>

                <div className="login-footer flex align-items-center">
                    <div className="flex align-items-center login-footer-logo-container">
                        <img src="assets/layout/images/logo-gray.png" className="login-footer-logo" alt="login-footer-logo" />
                        <img src="assets/layout/images/appname-gray.png" className="login-footer-appname" alt="login-footer-appname" />
                    </div>
                    <span>Copyright 2021</span>
                </div>
            </div>
        </div>
    );
};
