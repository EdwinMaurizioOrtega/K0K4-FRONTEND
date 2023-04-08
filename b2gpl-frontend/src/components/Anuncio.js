import React, {useEffect, useState} from 'react';
import {Button} from 'primereact/button';
import Form from "./Form/Form";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {deletePost, getPostsByIdCreator} from "../actions/posts";

import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import decode from "jwt-decode";
import * as actionType from "../constants/actionTypes";

const Anuncio = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));

    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const [currentId, setCurrentId] = useState(0);


    //console.log(user)
    const logout = () => {
        dispatch({type: actionType.LOGOUT});

        navigate('/');

        setUser(null);

        //window.location.reload(false);
    };

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();

            dispatch(getPostsByIdCreator(user?.result._id));
        }

        //setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);



    //const creator = user?.result._id;


    // useEffect(() => {
    //
    //     dispatch(getPostsByIdCreator(creator));
    //
    // }, []);

    const { posts } = useSelector((state) => state.posts);
    //console.log("Anuncios: "+posts);

    //if (!posts.length && !isLoading) return 'No posts';

    const filaPostseleccionado = (rowData) => {
        //console.log(rowData._id);
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => setCurrentId(rowData._id)}>
                    Editar
                </Button>
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => dispatch(deletePost(rowData._id))}>Borrar</Button>
            </div>
        );
    }


    return (

        <div className="card">

            {/*<span variant="h2">{user?.result._id}</span>*/}

            <div id="header" className="flex flex-column">

                <div className="header-features">
                    <div className="grid flex">
                        <div className="col-12 md:col-12 flex justify-content-center">
                            <Form currentId={currentId} setCurrentId={setCurrentId}/>
                        </div>
                    </div>
                </div>
            </div>


            <DataTable value={posts} responsiveLayout="scroll" dataKey="_id">
                <Column field="title" header="Título del anuncio"></Column>
                <Column field="createdAt" header="Fecha de creacion"></Column>
                <Column field="_id" body={filaPostseleccionado} header="ID"></Column>

            </DataTable>
        </div>
    )
}
export default Anuncio;
