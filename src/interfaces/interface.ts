export interface Credenciales {
    idUsuario?:  string;
    resultado:  string;
    contrasena?: string;

}
// Definición de la interfaz para el token decodificado
export interface DecodedToken {
    userId: string;
    // Puedes agregar otras propiedades aquí si las necesitas
  }

export const key_secret = ".;v20}%u0hGsKDcdV£H/R;?tc'*IgfVj(V0?yS(jAt_/4.5udt"
