export type AuthorizedEmails = {
  id: number;
  correo: string;
  fecha_registro: Date;
  fecha_expiracion: Date;
  permitir_acceso: boolean;
  id_rol: number;
};
