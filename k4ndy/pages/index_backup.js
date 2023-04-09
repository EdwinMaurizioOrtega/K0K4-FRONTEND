import React, {useContext, useEffect, useRef, useState} from 'react';
import getConfig from 'next/config';
import {FilterMatchMode, FilterOperator} from 'primereact/api';
import {Button} from 'primereact/button';
import {Chart} from 'primereact/chart';
import {Column} from 'primereact/column';
import {DataTable} from 'primereact/datatable';
import {Dropdown} from 'primereact/dropdown';
import {InputText} from 'primereact/inputtext';
import {Knob} from 'primereact/knob';
import {Rating} from 'primereact/rating';
import {ProductService} from '../demo/service/ProductService';
import {LayoutContext} from '../layout/context/layoutcontext';
import {Tooltip} from 'primereact/tooltip';
import {Toast} from "primereact/toast";

export default function ECommerce() {

    const [pedidoProveedor, setPedidoProveedor] = useState(''); //INIT TO EMPTY
    const [procedencia, setProcedencia] = useState(''); //INIT TO EMPTY
    const [jsonData, setJsonData] = useState([]);

    const toast = useRef(null);

    const handleClick = () => {
        fetch('http://localhost/api/wms/reporte_pedido_proveedor')
            .then(response => response.json())
            .then(data => setJsonData(data.data));
    };

    return (
        <div className="grid">

            <Toast ref={toast}/>
            <div className="col-12 md:col-12">
                <div className="card p-fluid">

                    <h1 className="mb-2 ls-m">Buscar por pedido proveedor</h1>
                    <div className="App" style={{display: "contents"}}>

                        <div className="input-wrapper input-wrapper-inline input-wrapper-round">
                            <InputText type="text" className="form-control email" name="email" id="email2"
                                       placeholder="PEDIDO PROVEEDOR" required
                                       value={pedidoProveedor}
                                       onChange={e => {
                                           setPedidoProveedor(e.currentTarget.value);
                                       }}
                            />

                            <InputText type="text" className="form-control email" name="email" id="email2"
                                       placeholder="PROCEDENCIA" required
                                       value={procedencia}
                                       onChange={e => {
                                           setProcedencia(e.currentTarget.value);
                                       }}
                            />
                            <Button className="btn btn-dark"

                                    onClick={() => {
                                        handleClick()
                                    }}
                            >BUSCAR</Button>
                        </div>
                        {/*<h5>{garantia}</h5>*/}


                        <DataTable value={jsonData} responsiveLayout="scroll" dataKey="PEDIDO_PROV">
                            <Column field="PEDIDO_PROV" header="PEDIDO_PROV"></Column>
                            <Column field="FEC_INGRESO" header="FEC_INGRESO"></Column>
                            <Column field="USUARIO" header="USUARIO"></Column>
                            <Column field="ESTATUS" header="ESTATUS"></Column>
                            <Column field="PEDIDO_PROV_TIPO" header="PEDIDO_PROV_TIPO"></Column>
                            <Column field="DESCRIPCION" header="DESCRIPCION"></Column>
                            <Column field="DATO1" header="DATO1"></Column>
                            <Column field="DATO2" header="DATO2"></Column>
                            <Column field="DATO3" header="DATO3"></Column>
                            <Column field="DATO4" header="DATO4"></Column>
                            <Column field="FACTURA" header="FACTURA"></Column>
                            <Column field="FACTURA_FAB" header="FACTURA_FAB"></Column>
                            <Column field="VAL1" header="VAL1"></Column>
                            <Column field="VAL2" header="VAL2"></Column>
                            <Column field="PESO" header="PESO"></Column>

                        </DataTable>


                    </div>

                </div>

            </div>

        </div>
    );
}
