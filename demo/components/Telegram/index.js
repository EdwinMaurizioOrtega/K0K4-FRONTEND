import axios from 'axios';

export default async function EnviarMensaje(props) {

    const {selectedFile, _id, title, category, city} = props;

    const botToken = '5948269042:AAH47R9kjKPexgYokAMRxYgF8z5ZrSF7bYc';
    const chatId = '-1001876640043';

    if (!selectedFile) {
        console.error('Image Base64 string is empty');
        return;
    }

    const imageData = selectedFile.replace(/^data:image\/(jpeg|png|gif);base64,/, '');

    //console.log(imageData);

    // Convertir la cadena Base64 a un Blob
    const byteCharacters = atob(imageData);
    const byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    const blob = new Blob(byteArrays, {type: 'image/jpeg'});

    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('photo', blob, 'image.jpg');

    //Body message
    const mensaje = title;
    const linkUrl = 'https://ec.k0k4.com/'+ category + '/' + city + "/" + _id;
    const textCity = city;
    const linkText = 'Ha actualizado su perfil';

    const mensajeCompleto = `${textCity} ${mensaje} \n${linkUrl}: ${linkText}`;

    formData.append('caption', mensajeCompleto);

    try {
        const response = await axios.post(
            `https://api.telegram.org/bot${botToken}/sendPhoto`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                maxContentLength: 10 * 1024 * 1024, // 10 MB
            }
        );

        //console.log('Image sent successfully');
    } catch (error) {
        if (error.response && error.response.data && error.response.data.description) {
            //console.error('Telegram API Error:', error.response.data.description);
        } else {
            //console.error('Failed to send image:', error);
        }
    }

}
