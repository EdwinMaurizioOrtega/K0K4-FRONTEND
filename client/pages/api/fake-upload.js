// pages/api/fake-upload.js

export default async function handler(req, res) {
    // Simulamos un tiempo de carga falso
    //await new Promise(resolve => setTimeout(resolve, 2000));

    // Puedes realizar cualquier lógica adicional aquí si es necesario

    console.log('Carga simulada exitosa')
    // Respondemos con un mensaje
    res.status(200).json({ message: 'Carga simulada exitosa' });
}
