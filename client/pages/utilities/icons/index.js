import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { IconService } from '../../../demo/service/IconService';
import { InputText } from 'primereact/inputtext';

const IconsDemo = () => {
    const [icons, setIcons] = useState([]);
    const [filteredIcons, setFilteredIcons] = useState([]);

    useEffect(() => {
        new IconService().getIcons().then((data) => {
            data.sort((icon1, icon2) => {
                if (icon1.properties.name < icon2.properties.name) return -1;
                else if (icon1.properties.name < icon2.properties.name) return 1;
                else return 0;
            });

            setIcons(data);
            setFilteredIcons(data);
        });
    }, []);

    const onFilter = (event) => {
        if (!event.target.value) {
            setFilteredIcons(icons);
        } else {
            setFilteredIcons(
                icons.filter((it) => {
                    return it.icon.tags[0].includes(event.target.value);
                })
            );
        }
    };

    return (
        <div className="card">
            <h2>Icons</h2>
            <p>
                PrimeReact components internally use {/* @see https://github.com/vercel/next.js/commit/489e65ed98544e69b0afd7e0cfc3f9f6c2b803b7 */}
                    <a className="font-medium hover:underline" target={'_blank'}>
                        PrimeIcons
                    </a>
                library, the official icons suite from {/* @see https://github.com/vercel/next.js/commit/489e65ed98544e69b0afd7e0cfc3f9f6c2b803b7 */}
                    <a className="font-medium hover:underline" target={'_blank'}>
                        PrimeTek
                    </a>
                .
            </p>

            <h4>Download</h4>
            <p>PrimeIcons is available at npm, run the following command to download it to your project.</p>
<pre className="app-code"><code>{
`npm install primeicons --save`
}
</code></pre>

            <h4>Getting Started</h4>
            <p>
                PrimeIcons use the <strong>pi pi-&#123;icon&#125;</strong> syntax such as <strong>pi pi-check</strong>. A standalone icon can be displayed using an element like <i>i</i> or <i>span</i>
            </p>

<pre className="app-code"><code>{
`<i className="pi pi-check" style={{ marginRight: '.5rem' }}></i>
<i className="pi pi-times"></i>`
}
</code></pre>

            <h4>Size</h4>
            <p>Size of the icons can easily be changed using font-size property.</p>

<pre className="app-code"><code>{
`<i className="pi pi-check"></i>
<i className="pi pi-times"></i>`
}
</code></pre>

            <i className="pi pi-check mr-2"></i>
            <i className="pi pi-times"></i>

<pre className="app-code"><code>{
`<i className="pi pi-check" style={{ fontSize: '2rem' }}></i>`
}
</code></pre>

            <i className="pi pi-check" style={{ fontSize: '2rem' }}></i>

            <h4>Spinning Animation</h4>
            <p>Special pi-spin class applies continuous rotation to an icon.</p>
<pre className="app-code"><code>{
`<i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>`}
</code></pre>

            <i className="pi pi-spin pi-spinner" style={{ fontSize: '2rem' }}></i>

            <h4>List of Icons</h4>
            <p>
                Here is the current list of PrimeIcons, more icons are added periodically. You may also
                {/* @see https://github.com/vercel/next.js/commit/489e65ed98544e69b0afd7e0cfc3f9f6c2b803b7 */}{' '}
                    <a className="font-medium hover:underline" target={'_blank'}>
                        request new icons
                    </a>
                at the issue tracker.
            </p>

            <div>
                <InputText type="text" className="w-full p-3 mt-3 mb-5" onInput={onFilter} placeholder="Search an icon" />
            </div>
            <div className="grid icons-list text-center">
                {filteredIcons &&
                    filteredIcons.map((iconMeta) => {
                        const { icon, properties } = iconMeta;

                        return (
                            icon.tags.indexOf('deprecate') === -1 && (
                                <div className="col-6 sm:col-4 lg:col-3 xl:col-2 pb-5" key={properties.name}>
                                    <i className={'text-2xl mb-2 pi pi-' + properties.name}></i>
                                    <div>pi-{properties.name}</div>
                                </div>
                            )
                        );
                    })}
            </div>
        </div>
    );
};

export default IconsDemo;
