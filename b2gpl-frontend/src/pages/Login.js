import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import {Link, useNavigate} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
// import { GoogleLogin } from 'react-google-login';
import { signin, signup } from '../actions/auth';
import { AUTH } from '../constants/actionTypes';
import {Messages} from "primereact/messages";
import {signIn} from "../api";

const initialState = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' };

export const Login = () => {

    let respuestaError  = useSelector((state) => state.auth.authData?.response.data.message);
    console.log("Error: "+respuestaError);

    const message = useRef();
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

        console.log("Botón handleSubmit: "+ e);
            //Registrarse
        if (isSignup) {
            console.log("Registrarse: "+form);
            if (form.firstName !== '' && form.lastName !== '' && form.email !== '' && form.password !== '' && form.confirmPassword !== ''){
                dispatch(signup(form, history));

            }else {
                message.current.show({ severity: 'warn', content: 'Hola! 👋🏻 Todos los datos son necesarios.' });
            }
        } else {
            //Iniciar sesión
          console.log("Iniciar sesión: "+form);
          if ( form.email !== '' && form.password !== ''){
              console.log(form.email);
              console.log(form.password);
              dispatch(signin(form, history));

              //Validamos los errores
              if (respuestaError != undefined){

                  message.current.show({ severity: 'warn', content: ' Hola! 👋🏻 '+ respuestaError });
                  respuestaError = undefined;

              }

          }else {
              console.log("Verificar el correo y la contraseña.")
              message.current.show({ severity: 'warn', content: ' Hola! 👋🏻 Verificar el correo y la contraseña.' });

          }
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
                    <Link to={'/'}>
                    <div className="flex align-items-center mb-6 logo-container">
                        {/*<img src={`assets/layout/images/logo-dark.png`} className="login-logo" alt="login-logo" />*/}
                        <img src={`assets/layout/images/appname-dark.png`} style={{height: '60px'}} alt="login-appname" />
                    </div>
                    </Link>
                    <form onSubmit={handleSubmit}>
                        <div className="form-container">
                            {isSignup && (
                                <>
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-envelope"></i>
                                        <InputText type="text" name="firstName" placeholder="Primer nombre" onChange={handleChange} />
                                    </span>
                                    <span className="p-input-icon-left">
                                        <i className="pi pi-key"></i>
                                        <InputText type="text" placeholder="Apellido" name="lastName" onChange={handleChange} />
                                    </span>
                                </>
                            )}

                            <span className="p-input-icon-left">
                                <i className="pi pi-envelope"></i>
                                <InputText keyfilter={/[^s]/} name="email" placeholder="Correo electrónico" onChange={handleChange} />
                            </span>
                            <span className="p-input-icon-left">
                                <i className="pi pi-key"></i>
                                <InputText  placeholder="Contraseña" name="password" onChange={handleChange} />
                            </span>

                            {isSignup &&
                                <span className="p-input-icon-left">
                                <i className="pi pi-key"></i>
                                <InputText name="confirmPassword" placeholder="Repite la contraseña" onChange={handleChange}  />
                             </span>
                            }

                            <Messages ref={message} />

                            <button className="flex p-link">¿Olvidaste tu contraseña?</button>
                        </div>
                        <div className="button-container">
                            <Button type="submit">{isSignup ? 'Regístrate' : 'Acceder'}</Button>
                            <span>
                                ¿No tienes una cuenta?
                                <button className="p-link" onClick={switchMode}>
                                    {isSignup ? 'Acceder' : 'Regístrate'}
                                </button>
                            </span>
                        </div>
                    </form>
                </div>

                {/*<div className="login-footer flex align-items-center">*/}
                {/*    <div className="flex align-items-center login-footer-logo-container">*/}
                {/*        /!*<img src="assets/layout/images/logo-dark.png" className="login-footer-logo" alt="login-footer-logo" />*!/*/}
                {/*        <img src="assets/layout/images/appname-dark.png" className="login-footer-appname" alt="login-footer-appname" />*/}
                {/*    </div>*/}
                {/*    <span>&#169; B2|GPL - 2023</span>*/}
                {/*</div>*/}
            </div>
        </div>
    );
};
