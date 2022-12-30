import React, {useEffect, useState} from 'react';
import {Button} from 'primereact/button';
import {Chip} from 'primereact/chip';
import {InputText} from 'primereact/inputtext';
import {Checkbox} from 'primereact/checkbox';
import BlockViewer from '../BlockViewer';
import Form from "./Form/Form";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {getPost, getPostsBySearch} from "../actions/posts";
import {ProgressSpinner} from "primereact/progressspinner";

const Anuncio = () => {

    const [currentId, setCurrentId] = useState(0);

    return (

        <div className="card">
        <div id="header" class="flex flex-column">

            <div class="header-features">
                <div class="grid flex">
                    <div class="col-12 md:col-4 flex justify-content-center">
                        <Form currentId={currentId} setCurrentId={setCurrentId}/>

                    </div>

                </div>
            </div>
        </div>

        </div>
    )
}
export default Anuncio;
