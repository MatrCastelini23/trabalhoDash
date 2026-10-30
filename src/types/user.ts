export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Dados enviados pelo formulário (sem id)
export type UserFormData = Omit<User, "id">;

// Usuário como é exibido na tela (a senha nunca vai para a interface)
export type UserPublic = Omit<User, "password">;