import React, {useState, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import FileBase from 'react-file-base64';

import {createPost, updatePost} from '../../actions/posts';
import {Button} from 'primereact/button';


import {Chips} from 'primereact/chips';

import {Dropdown} from 'primereact/dropdown';

import {ListBox} from 'primereact/listbox';
import {useRouter} from "next/router";
import {InputText} from "primereact/inputtext";
import {InputTextarea} from "primereact/inputtextarea";
import {Message} from "primereact/message";


const FormPublication = ({currentId, setCurrentId}) => {
    const toast = useRef(null);
    const [postData, setPostData] = useState({
        title: '',
        message: '',
        cellphone: '',
        city: '',
        tags: [],
        selectedFile: []
    });
    console.log("Post: " + currentId);
    const post = useSelector((state) => (currentId ? state.posts.postsByUser.find((message) => message._id === currentId) : null));
    const dispatch = useDispatch();
    const [user, setUser] = useState(null);

    const history = useRouter();

    const [selectedCountry, setSelectedCountry] = useState(null);

    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('profile'));
        setUser(data);
    }, []);


    const clear = () => {
        setCurrentId(0);
        setPostData({title: '', message: '', cellphone: '', city: '', tags: [], selectedFile: []});
    };

    function refreshPage() {
        history.reload();
    }

    useEffect(() => {
        if (!post?.title) clear();
        if (post) setPostData(post);
    }, [post]);

    const [errors, setErrors] = useState({});


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validar los campos del formulario
        const formErrors = {};
        if (!postData.title) {
            formErrors.title = "El título es obligatorio";
        }
        if (!postData.message) {
            formErrors.message = "El contenido es obligatorio";
        }
        if (!postData.cellphone) {
            formErrors.cellphone = "El número de celular es obligatorio";
        }
        if (!selectedCountry) {
            formErrors.country = "Debes seleccionar una ciudad";
        }

        // Verificar si hay errores de validación
        if (Object.keys(formErrors).length === 0) {

            setIsLoading(true);

            // No hay errores, enviar el formulario

            if (currentId === 0) {
                //Nuevo
                try {
                    await dispatch(createPost({...postData, name: user?.result?.name}, history));
                    clear();

                } catch (error) {
                    console.log('Error al crear el post:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                //Actualizar
                try {

                    console.log("Actualizar: " + postData);
                    await dispatch(updatePost(currentId, {...postData, name: user?.result?.name}));
                    if (toast.current) {
                        toast.current.show({
                            severity: 'success',
                            summary: 'Felicidades',
                            detail: 'El anuncio se ha actualizado.',
                            life: 3000
                        });
                    }

                } catch (error) {
                    console.log('Error al actualizar el post:', error);
                } finally {
                    setIsLoading(false);
                    clear();
                    refreshPage();
                }

            }


        } else {
            // Hay errores, actualizar el estado de los errores
            setErrors(formErrors);
        }


    };

    if (!user?.result?.name) {
        return <h3>Inicie sesión para crear sus propios recuerdos y darle me gusta a los recuerdos de otros.</h3>;
    }

    const handleAddChip = (tag) => {
        console.log(tag);
        setPostData({...postData, tags: [...postData.tags, tag]});
    };

    const handleDeleteChip = (chipToDelete) => {
        setPostData({...postData, tags: postData.tags.filter((tag) => tag !== chipToDelete)});
    };

    const handleAddImage = (img) => {
        //      console.log(img[0].base64);
        const pictutes = [];

        img.forEach((element) => {
            //console.log(element.base64);
            pictutes.push(element.base64);
            //console.log(pictutes);
        });

        //console.log(pictutes);
        setPostData({...postData, selectedFile: pictutes});
        console.log(postData);
    };

    const countries = [
        {name: 'Quito', code: 'Quito'},
        {name: 'Guayaquil', code: 'Guayaquil'},
        {name: 'Cuenca', code: 'Cuenca'},
        {name: 'Ambato', code: 'Ambato'},
        {name: 'Durán', code: 'Durán'},
        {name: 'Esmeraldas', code: 'Esmeraldas'},
        {name: 'Ibarra', code: 'Ibarra'},
        {name: 'Latacunga', code: 'Latacunga'},
        {name: 'Loja', code: 'Loja'},
        {name: 'Machala', code: 'Machala'},
        {name: 'Manta', code: 'Manta'},
        {name: 'Portoviejo', code: 'Portoviejo'},
        {name: 'Quevedo', code: 'Quevedo'},
        {name: 'Riobamba', code: 'Riobamba'},
        {name: 'Salinas', code: 'Salinas'},
        {name: 'Sangolqui', code: 'Sangolqui'},
        {name: 'Santo Domingo', code: 'Santo Domingo'},
    ];

    const onCountryChange = (e) => {

        setSelectedCountry(e.value)

        console.log(e.target.value.name);
        const aux = e.target.value.name;
        setPostData({...postData, city: aux})
        console.log(postData);

    }

    const selectedCountryTemplate = (option, props) => {
        if (option) {
            return (
                <div className="country-item country-item-value">
                    <div>{option.name}</div>
                </div>
            );
        }

        return (
            <span>
                {props.placeholder}
            </span>
        );
    }

    const countryOptionTemplate = (option) => {
        return (
            <div className="country-item">
                <div>{option.name}</div>
            </div>
        );
    }

    return (
        <div className="card">
            <span className="block text-900 font-bold text-xl mb-4">¡Publica gratis siguiendo unos pocos pasos!</span>
            <div className="grid">
                <div className="col-12 lg:col-12">
                    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <div className="flex flex-column p-fluid">
                            <div className="mb-4">
                                <h6>{currentId ? `Editando "${post?.title}"` : 'Crear anuncio'}</h6>
                            </div>
                            <div className="mb-4">
                                <InputText
                                    name="title"
                                    label="Título"
                                    placeholder="Título"
                                    value={postData.title}
                                    onChange={(e) => setPostData({...postData, title: e.target.value})}
                                    required
                                />
                                {errors.title && <Message severity="error" text={errors.title}/>}
                            </div>
                            <div className="mb-4">
                                <InputTextarea
                                    name="message"
                                    label="Contenido"
                                    rows={6} placeholder="Contenido"
                                    autoResize value={postData.message}
                                    onChange={(e) => setPostData({...postData, message: e.target.value})}
                                    required
                                />
                                {errors.message && <Message severity="error" text={errors.message}/>}
                            </div>
                            <div className="mb-4">
                                <h6>Número celular - WhatsApp: </h6>
                                <InputText
                                    name="cellphone"
                                    label="Célular"
                                    placeholder="Célular"
                                    value={postData.cellphone}
                                    onChange={(e) => setPostData({...postData, cellphone: e.target.value})}
                                    required
                                />
                                {errors.cellphone && <Message severity="error" text={errors.cellphone}/>}
                            </div>
                            <div className="mb-4">
                                <h6>Seleccionar la ciuada: </h6>
                                <ListBox
                                    filter
                                    value={selectedCountry}
                                    options={countries}
                                    onChange={onCountryChange}
                                    optionLabel="name"
                                    style={{width: '15rem'}}
                                    listStyle={{maxHeight: '250px'}}
                                    required
                                />
                                {errors.country && <Message severity="error" text={errors.country}/>}
                            </div>
                            <div className="mb-4">
                                <h6>Debes subir al menos una imagen: </h6>
                                <FileBase
                                    type="file"
                                    multiple={true}
                                    onDone={(base64) => handleAddImage(base64)}
                                />
                            </div>
                        </div>
                        <div className="flex justify-content-between gap-3">
                            <Button className="p-button-danger flex-1 p-button-outlined" label="Descartar"
                                    icon="pi pi-fw pi-trash" onClick={clear}></Button>

                            {isLoading ?
                                <img src={`../../../layout/images/5db61a9d71fa2c97ffff30c83dcaa6e5.gif`} style={{
                                    height: '100%',
                                    display: "block",
                                    marginLeft: "auto",
                                    marginRight: "auto",
                                    width: "10%"
                                }} alt="Cargando..."/> :

                                <Button type="submit" className="p-button-primary flex-1" label="Publicar"
                                        icon="pi pi-fw pi-check" disabled={isLoading}>
                                </Button>

                            }

                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormPublication;
