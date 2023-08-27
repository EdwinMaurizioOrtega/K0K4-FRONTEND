// Importar los módulos y tipos necesarios
use std::fmt; // Importa el módulo para formateo de texto
use actix_web::error::ErrorUnauthorized; // Importa el tipo de error de autorización de Actix Web
use actix_web::{dev::Payload, Error as ActixWebError, HttpMessage, HttpRequest}; // Importa tipos y módulos de Actix Web
use std::future::{ready, Ready}; // Importa tipos relacionados con futuros
use jsonwebtoken::{decode, DecodingKey, Validation}; // Importa tipos para trabajar con JWT
use serde::Serialize; // Importa el módulo de serialización serde

use crate::models::user_model::{TokenClaims, UserIdentifier}; // Importa la estructura TokenClaims desde tu módulo

// Define una estructura para representar una respuesta de error
#[derive(Debug, Serialize)]
struct ErrorResponse {
    status: String,
    message: String,
}

// Implementa el trait fmt::Display para la estructura ErrorResponse
impl fmt::Display for ErrorResponse {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        // Genera una cadena de formato con los valores de status y message
        write!(f, "ErrorResponse {{ status: {}, message: {} }}", self.status, self.message)
    }
}

// Define la estructura JwtMiddleware con un campo para almacenar user_id
pub struct JwtMiddleware {
    pub user_id: String,
    pub user_name: String,
}

// Implementa el trait actix_web::FromRequest para JwtMiddleware
impl actix_web::FromRequest for JwtMiddleware {
    type Error = ActixWebError; // Tipo de error del trait
    type Future = Ready<Result<Self, Self::Error>>; // Tipo de futuro que devuelve el trait

    // Implementa el método from_request para realizar la autenticación JWT
    fn from_request(req: &HttpRequest, _: &mut Payload) -> Self::Future {
        // Obtén el valor del encabezado "Authorization"
        if let Some(auth_header) = req.headers().get("Authorization") {
            if let Ok(auth_value) = auth_header.to_str() {
                // Divide el valor del encabezado en partes separadas por espacios en blanco
                let authorization_parts: Vec<&str> = auth_value.split_whitespace().collect();
                if let Some(jwt_token) = authorization_parts.get(1) {
                    // Aquí estamos usando el método `get(1)` en el vector `authorization_parts` para obtener la segunda parte del encabezado.
                    // Recordemos que las partes del encabezado "Authorization" están separadas por espacios en blanco, y estamos interesados en la segunda parte.
                    // La primera parte generalmente es algo como "Bearer", que no necesitamos en este caso.

                    // Elimina posibles espacios en blanco adicionales del token
                    let jwt_token = jwt_token.trim();

                    // Verifica si el token está vacío
                    if jwt_token.is_empty() {
                        // Crea una respuesta de error si el token está vacío
                        let json_error = ErrorResponse {
                            status: "fail".to_string(),
                            message: "You are not logged in, please provide token".to_string(),
                        };
                        return ready(Err(ErrorUnauthorized(json_error)));
                    }

                    // Imprime el token recibido con fines de depuración
                    println!("Token: {:?}", jwt_token);

                    // Decodifica el token JWT
                    let secret_key = ",2023;MongoDB"; // Cambia esto por tu clave secreta

                    match decode::<TokenClaims>(
                        jwt_token,
                        &DecodingKey::from_secret(secret_key.as_ref()),
                        &Validation::default(),
                    ) {
                        Ok(decoded) => {
                            // Extrae el user_id y user_name del token decodificado
                            let user_id = decoded.claims._id.to_owned();
                            let user_name = decoded.claims.username.to_owned();

                            // Inserta user_id y user_name en las extensiones de la solicitud
                            req.extensions_mut().insert::<UserIdentifier>(UserIdentifier {
                                user_id: user_id.clone(),
                                user_name: user_name.clone(),
                            });

                            // Crea una instancia de JwtMiddleware con el user_id
                            let jwt_middleware = JwtMiddleware {
                                user_id: user_id.clone(),
                                user_name: user_name.clone(),
                            };
                            return ready(Ok(jwt_middleware));
                        }
                        Err(_) => {
                            // Crea una respuesta de error si el token es inválido
                            let json_error = ErrorResponse {
                                status: "fail".to_string(),
                                message: "Invalid token".to_string(),
                            };
                            return ready(Err(ErrorUnauthorized(json_error)));
                        }
                    }
                }
            }
        }
        // Crea una respuesta de error si el token no se proporcionó
        ready(Err(ErrorUnauthorized("Token not provided".to_string())))
    }
}