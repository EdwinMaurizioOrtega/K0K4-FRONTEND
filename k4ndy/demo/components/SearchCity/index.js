import {Toast} from "primereact/toast";
import {CascadeSelect} from "primereact/cascadeselect";
import {useForm, Controller} from 'react-hook-form';
import {Button} from "primereact/button";
import {useRef} from "react";
import {classNames} from 'primereact/utils';
import {useRouter} from "next/router";


const SearchCity = () => {

    const router = useRouter();

    const toast = useRef(null);

    const category = [

        {cname: 'Escorts', code: 'escorts'},
        {cname: 'Trans Y Travestis', code: 'travestis'},
        {cname: 'Escorts Masculinos', code: 'escorts-masculinos'},
        {cname: 'Encuentros Casuales', code: 'encuentros'},
    ];
    const countries = [

        {cname: 'Ambato', code: 'ambato'},
        {cname: 'Cuenca', code: 'cuenca'},
        {cname: 'Durán', code: 'duran'},
        {cname: 'Esmeraldas', code: 'esmeraldas'},
        {cname: 'Guayaquil', code: 'guayaquil'},
        {cname: 'Ibarra', code: 'ibarra'},
        {cname: 'Latacunga', code: 'latacunga'},
        {cname: 'Loja', code: 'loja'},
        {cname: 'Machala', code: 'machala'},
        {cname: 'Manta', code: 'manta'},
        {cname: 'Portoviejo', code: 'portoviejo'},
        {cname: 'Quevedo', code: 'quevedo'},
        {cname: 'Quito', code: 'quito'},
        {cname: 'Riobamba', code: 'riobamba'},
        {cname: 'Salinas', code: 'salinas'},
        {cname: 'Sangolqui', code: 'sangolqui'},
        {cname: 'Santo Domingo', code: 'santo-domingo'},

    ];

    const show = (data) => {
        toast.current.show({severity: 'success', summary: 'Buscar en: ', detail: `${data.city.cname}`});
        console.log("data: " + data);
        console.log("data: " + JSON.stringify(data));
        //router.push(`/apps/blog/city?name=${data.city.code}`);
        router.push(`/${data.category.code}/${data.city.code}`);
    };

    const defaultValues = {
        city: null
    };

    const {
        control,
        formState: {errors},
        handleSubmit,
        reset
    } = useForm({defaultValues});

    const onSubmit = (data) => {
        data.city && show(data);

        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> :
            <small className="p-error">&nbsp;</small>;
    };

    return (
        <div className=" flex justify-content-center">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-2">
                <Toast ref={toast}/>
                <Controller
                    name="category"
                    control={control}
                    rules={{required: 'Categoria requerida.'}}
                    render={({field, fieldState}) => (
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <CascadeSelect
                                id={field.name}
                                name="category"
                                value={field.value}
                                options={category}
                                optionLabel="cname"
                                optionGroupLabel="name"
                                optionGroupChildren={['states', 'cities']}
                                style={{minWidth: '14rem'}}
                                breakpoint="767px"
                                placeholder="Categoria"
                                className={classNames({'p-invalid': fieldState.error})}
                                onChange={(e) => field.onChange(e.value)}
                            />
                            {getFormErrorMessage('category')}
                        </div>
                    )}
                />

                <Controller
                    name="city"
                    control={control}
                    rules={{required: 'Ciudad obligatoria.'}}
                    render={({field, fieldState}) => (
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <CascadeSelect
                                id={field.name}
                                name="city"
                                value={field.value}
                                options={countries}
                                optionLabel="cname"
                                optionGroupLabel="name"
                                optionGroupChildren={['states', 'cities']}
                                style={{minWidth: '14rem'}}
                                breakpoint="767px"
                                placeholder="Todas las localidades"
                                className={classNames({'p-invalid': fieldState.error})}
                                onChange={(e) => field.onChange(e.value)}
                            />
                            {getFormErrorMessage('city')}
                        </div>
                    )}
                />

                <Button type="submit" label="Buscar"/>
            </form>
        </div>
    )
};

export default SearchCity;


