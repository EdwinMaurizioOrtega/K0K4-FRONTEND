import React from "react";
import AuthService from "../service/auth.service";
import {Button} from "primereact/button";
import {Chip} from "primereact/chip";

export const Profile = () => {
  const currentUser = AuthService.getCurrentUser();

  return (
    <div className="card">
        <div className="font-medium text-3xl text-900 mb-3">Nombre de usuario: {currentUser.username}</div>
        <ul className="list-none p-0 m-0">
            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                <div className="text-500 w-6 md:w-2 font-medium">Token:</div>
                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{currentUser.accessToken.substring(0, 20)} ...{" "}{currentUser.accessToken.substr(currentUser.accessToken.length - 20)}</div>

            </li>
            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                <div className="text-500 w-6 md:w-2 font-medium">Id:</div>
                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    {currentUser.id}

                </div>

            </li>
            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                <div className="text-500 w-6 md:w-2 font-medium">Email:</div>
                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">{currentUser.email}</div>
                <div className="w-6 md:w-2 flex justify-content-end">
                    <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                </div>
            </li>
            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                <div className="text-500 w-6 md:w-2 font-medium">Authorities:</div>
                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                    <ul>
                            {currentUser.roles &&
                              currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
                           </ul>
                </div>

            </li>

        </ul>
    </div>
  );
};

