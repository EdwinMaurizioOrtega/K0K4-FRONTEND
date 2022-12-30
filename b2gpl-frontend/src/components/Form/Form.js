import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import FileBase from 'react-file-base64';
import {useNavigate} from 'react-router-dom';

import {createPost, updatePost} from '../../actions/posts';
import {Button} from 'primereact/button';
import {InputText} from 'primereact/inputtext';
import {InputTextarea} from 'primereact/inputtextarea';

import {Chips} from 'primereact/chips';

const Form = ({currentId, setCurrentId}) => {
    const [postData, setPostData] = useState({title: '', message: '', tags: [], selectedFile: []});
    const post = useSelector((state) => (currentId ? state.posts.posts.find((message) => message._id === currentId) : null));
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('profile'));
    const history = useNavigate();

    const clear = () => {
        setCurrentId(0);
        setPostData({title: '', message: '', tags: [], selectedFile: []});
    };

    function refreshPage() {
        window.location.reload(false);
    }

    useEffect(() => {
        if (!post?.title) clear();
        if (post) setPostData(post);
    }, [post]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (currentId === 0) {
            dispatch(createPost({...postData, name: user?.result?.name}, history));
            clear();
        } else {
            console.log(postData);
            dispatch(updatePost(currentId, {...postData, name: user?.result?.name}));
            clear();
            refreshPage();
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

    //  constructor() {
    //      super();
    //    this.state = {
    //          files: []
    //      }
    //  }

    return (
        <div className="card">
            <span className="block text-900 font-bold text-xl mb-4">¡Publica gratis siguiendo unos pocos pasos!</span>
            <div className="grid">
                <div className="col-12 lg:col-8">
                    <form autoComplete="off" noValidate onSubmit={handleSubmit}>
                        <div className="flex flex-column p-fluid">
                            <div className="mb-4">
                                <span variant="h6">{currentId ? `Editando "${post?.title}"` : 'Crear una memoria-anuncio'}</span>
                            </div>

                            <div className="mb-4">
                                <InputText name="title" label="Título" placeholder="Título" value={postData.title} onChange={(e) => setPostData({...postData, title: e.target.value})}/>
                            </div>
                            <div className="mb-4">
                                <InputTextarea name="message" label="Contenido" rows={6} placeholder="Contenido" autoResize value={postData.message} onChange={(e) => setPostData({...postData, message: e.target.value})}></InputTextarea>
                            </div>


                            {/* <div>
                            <Chips name="tags" value={postData.tags}
                            onAdd={(chip) => handleAddChip(chip)}
                            onRemove={(chip) => handleDeleteChip(chip)}
                            variant="outlined" />
                        </div> */}
                            <div className="mb-4">
                                <FileBase type="file" multiple={true} onDone={(base64) => handleAddImage(base64)}/>
                            </div>

                        </div>
                        <div className="flex justify-content-between gap-3">
                            <Button className="p-button-danger flex-1 p-button-outlined" label="Descartar" icon="pi pi-fw pi-trash" onClick={clear}></Button>
                            <Button type="submit" className="p-button-primary flex-1" label="Publicar" icon="pi pi-fw pi-check"></Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Form;
