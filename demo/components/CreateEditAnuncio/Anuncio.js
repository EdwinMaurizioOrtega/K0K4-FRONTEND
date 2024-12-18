import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button} from 'primereact/button';
import {useDispatch, useSelector} from "react-redux";
import {deletePost, getPostsByIdCreator, topBannerUploadedIn} from "../../actions/posts";

import {DataTable} from 'primereact/datatable';
import {Column} from 'primereact/column';
import decode from "jwt-decode";
import * as actionType from "../../constants/actionTypes";
import {useRouter} from "next/router";
import EnviarMensaje from "../Telegram";
import {Toast} from "primereact/toast";
import FormPublication from "./Form";

const Anuncio = () => {

    const dispatch = useDispatch();
    const navigate = useRouter();
    const [currentId, setCurrentId] = useState(0);
    const { postsByUser } = useSelector((state) => state.posts);

    const logout = useCallback(() => {
        dispatch({ type: actionType.LOGOUT });
        navigate.push('/');
    }, [dispatch, navigate]);

    useEffect(() => {
        const storedProfile = JSON.parse(localStorage.getItem('profile'));
        const token = storedProfile?.token;

        if (token) {
            const decodedToken = decode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                logout();
            } else {
                const { _id, sub } = storedProfile.result;

                if (_id) {
                    dispatch(getPostsByIdCreator(_id));
                }

                if (sub) {
                    dispatch(getPostsByIdCreator(sub));
                }
            }
        }

    }, [dispatch, logout]);

    const toastRef = useRef(null);
    const handleEnviarTelegram = (rowData) => {

        //console.dir(rowData);

        const { _id, title, city, category, selectedFile } = rowData;

        if (!_id || !title || !city || !selectedFile) {
            // Mostrar mensaje de error en el Toast
            toastRef.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Faltan campos obligatorios',
                life: 3000 // Duración del Toast en milisegundos
            });
            return;
        }

        // Enviar el mensaje
        EnviarMensaje({
            _id: _id,
            title: title,
            category: category,
            city: city,
            selectedFile: selectedFile[0]
        });

        // Mostrar mensaje de éxito en el Toast
        toastRef.current.show({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Mensaje enviado correctamente',
            life: 3000 // Duración del Toast en milisegundos
        });
    };


    const handleDelete = async (id) => {
        //dispatch(deletePost(id));
        //navigate.reload(); // Recargar la página

        try {
            const response = await dispatch(deletePost(id));
            console.log('Respuesta de la API:', response);

            // Aquí puedes realizar más acciones según la respuesta de la API
            if (response && response.status === 200) {
                console.log('Respuesta de la API:', response);

                // Recargar la página solo si el código de estado es 200
                window.location.reload();
            } else {
                console.error('Error al eliminar la publicación:', response);
                // Aquí puedes manejar el error de alguna manera si es necesario
            }

        } catch (error) {
            console.error('Error al eliminar la publicación:', error);
        }
    };


    const filaPostseleccionado = (rowData) => {
        //console.log(rowData._id);
        return (
            <div className="actions">
                <Button icon="pi pi-check" className="p-button-rounded p-button-danger mr-2"
                        onClick={() => dispatch(topBannerUploadedIn(rowData._id.$oid, navigate))}>
                   Primer Lugar
                </Button>

                {/*Feature Premium*/}
                {/*<Button onClick={() => handleEnviarTelegram(rowData)}>*/}
                {/*    Telegram*/}
                {/*</Button>*/}

                {/*<Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2"*/}
                {/*        onClick={() => setCurrentId(rowData._id.$oid)}>*/}
                {/*    Editar*/}
                {/*</Button>*/}

                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mr-2"
                        onClick={()=>handleDelete(rowData._id.$oid)}>
                    Borrar
                </Button>

            </div>
        );
    }

    return (
        <>
            <Toast ref={toastRef} />
            <FormPublication currentId={currentId} setCurrentId={setCurrentId}/>

            <div className="card">
                <DataTable value={postsByUser} responsiveLayout="scroll" dataKey="_id.$oid">
                    <Column field="title" header="Título del anuncio"></Column>
                    {/*<Column field="created_at.$date" header="Fecha de creacion"></Column>*/}
                    <Column field="_id.$oid" body={filaPostseleccionado} header="Acciones"></Column>

                </DataTable>
            </div>


        </>


    )
}
export default Anuncio;
