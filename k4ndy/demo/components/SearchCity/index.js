import {Toast} from "primereact/toast";
import {CascadeSelect} from "primereact/cascadeselect";
import { useForm, Controller } from 'react-hook-form';
import {Button} from "primereact/button";
import {useRef} from "react";
import { classNames } from 'primereact/utils';
import {useRouter} from "next/router";



const SearchCity = () => {

    const router = useRouter();

    const toast = useRef(null);
    const countries = [

                        {cname: 'Ambato', code: 'Ambato'},
                        {cname: 'Cuenca', code: 'Cuenca'},
                        {cname: 'Durán', code: 'Durán'},
                        {cname: 'Esmeraldas', code: 'Esmeraldas'},
                        {cname: 'Guayaquil', code: 'Guayaquil'},
                        {cname: 'Ibarra', code: 'Ibarra'},
                        {cname: 'Latacunga', code: 'Latacunga'},
                        {cname: 'Loja', code: 'Loja'},
                        {cname: 'Machala', code: 'Machala'},
                        {cname: 'Manta', code: 'Manta'},
                        {cname: 'Portoviejo', code: 'Portoviejo'},
                        {cname: 'Quevedo', code: 'Quevedo'},
                        {cname: 'Quito', code: 'Quito'},
                        {cname: 'Riobamba', code: 'Riobamba'},
                        {cname: 'Salinas', code: 'Salinas'},
                        {cname: 'Sangolqui', code: 'Sangolqui'},
                        {cname: 'Santo Domingo', code: 'Santo Domingo'},

    ];

    const show = (data) => {
        toast.current.show({ severity: 'success', summary: 'Buscar en: ', detail: `${data.city.cname}` });

        router.push(`/apps/blog/city?name=${data.city.code}`);
    };

    const defaultValues = {
        city: null
    };

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({ defaultValues });

    const onSubmit = (data) => {
        data.city && show(data);

        reset();
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <div className=" flex justify-content-center">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-row gap-2">
                <Toast ref={toast} />
                <Controller
                    name="city"
                    control={control}
                    rules={{ required: 'City is required.' }}
                    render={({ field, fieldState }) => (
                        <CascadeSelect
                            id={field.name}
                            name="city"
                            value={field.value}
                            options={countries}
                            optionLabel="cname"
                            optionGroupLabel="name"
                            optionGroupChildren={['states', 'cities']}
                            style={{ minWidth: '14rem' }}
                            breakpoint="767px"
                            placeholder="Todas las localidades"
                            className={classNames({ 'p-invalid': fieldState.error })}
                            onChange={(e) => field.onChange(e.value)}
                        />
                    )}
                />
                {getFormErrorMessage('city')}
                <Button type="submit" label="Buscar" />
            </form>
        </div>
    )
};

export default SearchCity;


