// DTOs para entrada de login
export interface LoginDTO {
  username: string;
  password: string;
}

// DTO para la respuesta de autenticación
export interface AuthResponseDTO {
  token: string;
}

// Interface para el payload del JWT
export interface JwtPayload {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}