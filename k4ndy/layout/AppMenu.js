import AppSubMenu from './AppSubMenu';

const AppMenu = () => {
    const model = [
        {
            label: 'Blog',
            icon: 'pi pi-fw pi-comment',
            items: [
                // {
                //     label: 'List',
                //     icon: 'pi pi-fw pi-image',
                //     to: '/apps/blog/list'
                // },
                // {
                //     label: 'Detail',
                //     icon: 'pi pi-fw pi-list',
                //     to: '/apps/blog/detail'
                // },
                {
                    label: 'Crear | Editar',
                    icon: 'pi pi-fw pi-pencil',
                    to: '/apps/blog/edit'
                }
            ]
        }
    ];

    return <AppSubMenu model={model} />;
};

export default AppMenu;
