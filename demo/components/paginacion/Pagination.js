import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Paginator } from 'primereact/paginator';
import { getPosts } from '../../actions/posts';
import { useRouter } from 'next/router';

const Paginate = ({ page, categoria, ciudad }) => {
    const { numberOfPages } = useSelector((state) => state.posts);
    const dispatch = useDispatch();
    const router = useRouter();

    const totalRecords = numberOfPages ? numberOfPages * 10 : 0;

    const handlePageChange = async (event) => {
        const nextPage = event.page + 1;
        const href = `/${categoria}/?page=${nextPage}`;

        try {
            await router.push(href);
            // Realiza acciones adicionales después de que se complete la navegación
        } catch (error) {
            // Maneja cualquier error que pueda ocurrir durante la navegación
            console.error('Error al navegar:', error);
        }
    };

    console.log("categoria: "+categoria);

    useEffect(() => {
        if (page != null) {
            //Página de anuncions 30/P
            dispatch(getPosts(page, categoria, ciudad));
        }
    }, [dispatch, page, categoria, ciudad]);

    return (
        <Paginator
            first={0}
            rows={10}
            totalRecords={totalRecords}
            onPageChange={handlePageChange}
        />
    );
};

export default Paginate;
