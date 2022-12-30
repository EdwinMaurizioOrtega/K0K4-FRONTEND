import React, {useEffect, useState} from 'react';
import {Button} from 'primereact/button';
import {Chip} from 'primereact/chip';
import {InputText} from 'primereact/inputtext';
import {Checkbox} from 'primereact/checkbox';
import BlockViewer from '../BlockViewer';
import Form from "./Form/Form";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate, useParams} from "react-router-dom";
import {getPost, getPostsByCreator, getPostsByIdCreator, getPostsBySearch} from "../actions/posts";
import {ProgressSpinner} from "primereact/progressspinner";

import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import decode from "jwt-decode";
import * as actionType from "../constants/actionTypes";

const Anuncio = () => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('profile')));
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const logout = () => {
        dispatch({type: actionType.LOGOUT});

        navigate('/');

        setUser(null);

        window.location.reload(false);
    };

    useEffect(() => {
        const token = user?.token;

        if (token) {
            const decodedToken = decode(token);

            if (decodedToken.exp * 1000 < new Date().getTime()) logout();
        }

        setUser(JSON.parse(localStorage.getItem('profile')));
    }, [location]);


    console.log(user)

    const [currentId, setCurrentId] = useState(0);
    const creator = user?.result._id;
    const {posts, isLoading} = useSelector((state) => state.posts);

    useEffect(() => {

        dispatch(getPostsByIdCreator(creator));

    }, []);

    //if (!posts.length && !isLoading) return 'No posts';

    const filaPostseleccionado = (rowData) => {
        console.log(rowData._id);
        return <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => setCurrentId(rowData._id)}>
            Editar
        </Button>

    }

    return (

        <div className="card">

            {/*<span variant="h2">{user?.result._id}</span>*/}

            <div id="header" class="flex flex-column">

                <div class="header-features">
                    <div class="grid flex">
                        <div class="col-12 md:col-12 flex justify-content-center">
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
