import {Divider} from "primereact/divider";
import React from "react";
import {Button} from "primereact/button";


export default function Post({post}) {
    const photo = "192.168.1.16:3000/a";

    return (
        <div className="post" id={post.id}>

            <div className="card">
                <div className="text-3xl font-medium text-900 mb-3">{post.title}</div>
                <div className="font-medium text-500 mb-3">{post.content}</div>
                <div style={{height: '150px'}} className="border-2 border-dashed border-300">
                            {/*<img src="assets/images/blocks/hero/hero-1.png" alt="hero-1" className="md:ml-auto block md:h-full" style={{clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)'}}/>*/}


                </div>

            </div>

            {/*<div className="grid grid-nogutter surface-0 text-800">*/}
            {/*    <div className="col-12 md:col-6 p-6 text-center md:text-left flex align-items-center ">*/}
            {/*        <section>*/}
            {/*            <span className="block text-6xl font-bold mb-1">{post.title}</span>*/}
            {/*            /!*<div className="text-6xl text-primary font-bold mb-3">your visitors deserve to see</div>*!/*/}
            {/*            <p className="mt-0 mb-4 text-700 line-height-3">{post.content}</p>*/}

            {/*            /!*<Button label="Learn More" type="button" className="mr-3 p-button-raised" />*!/*/}
            {/*            /!*<Button label="Live Demo" type="button" className="p-button-outlined" />*!/*/}
            {/*        </section>*/}
            {/*    </div>*/}
            {/*    <div className="col-12 md:col-6 overflow-hidden">*/}
            {/*        <img src="https://www.primefaces.org/primeblocks-react/assets/images/blocks/hero/hero-1.png" alt="hero-1" className="md:ml-auto block md:h-full" style={{clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)'}}/>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <Divider/>

        </div>

    );

}

