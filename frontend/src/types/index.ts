export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface Turno {
  id: string;
  fecha: string;
  hora: string;
  servicio: string;
  precio: number;
  userId: string;
  estado: 'confirmado' | 'cancelado' | 'completado';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  token: string | null;
}

export interface ServicioPrecios {
  id: string;
  nombre: string;
  precio: number;
  duracion: string;
  descripcion: string;
}

export interface FormTurnoData {
  fecha: string;
  hora: string;
  servicio: string;
}
