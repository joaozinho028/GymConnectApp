import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Tipos dos dados do usuário
export interface Endereco {
	endereco: string;
	CEP: string;
	cidade: string;
	estado: string;
	pais: string;
}

export interface Usuario {
	id_usuario: number;
	nome_usuario: string;
	email_usuario: string;
	telefone_usuario: string;
	cpf_usuario: string;
	status_usuario: boolean;
	endereco_usuario: string | Endereco | null;
	foto_usuario?: string | null;
	// outros campos se necessário
}

interface AuthContextType {
	usuario: Usuario | null;
	setUsuario: (usuario: Usuario | null) => void;
	loading: boolean;
	token: string | null;
	setToken: (token: string | null) => void;
	fetchUsuario: () => Promise<void>;
	atualizarUsuario: (dados: any) => Promise<boolean>;
	enviarFotoUsuario: (fotoBase64: string) => Promise<string | null>;
	excluirFotoUsuario: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({
	usuario: null,
	setUsuario: () => {},
	loading: false,
	token: null,
	setToken: () => {},
	fetchUsuario: async () => {},
	atualizarUsuario: async () => false,
	enviarFotoUsuario: async () => null,
	excluirFotoUsuario: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [usuario, setUsuario] = useState<Usuario | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	// Buscar token salvo e dados do usuário ao iniciar
	useEffect(() => {
		const loadTokenAndUser = async () => {
			setLoading(true);
			const savedToken = await AsyncStorage.getItem("token");
			if (savedToken) {
				setToken(savedToken);
				await fetchUsuario(savedToken);
			}
			setLoading(false);
		};
		loadTokenAndUser();
	}, []);

	// Função para buscar dados do usuário
	const fetchUsuario = async (overrideToken?: string) => {
		try {
			const authToken = overrideToken || token;
			console.log("[AuthContext] authToken:", authToken);
			if (!authToken) {
				console.log("[AuthContext] Nenhum token encontrado.");
				return;
			}
			const response = await axios.get(
				`${process.env.EXPO_PUBLIC_API_URL}/auth/buscarusuario`,
				{
					headers: { Authorization: `Bearer ${authToken}` },
				}
			);
			console.log("[AuthContext] resposta da API:", response.data);
			let usuarioData = response.data.usuario;
			// Tratar endereço como JSON
			if (usuarioData && usuarioData.endereco_usuario) {
				try {
					usuarioData.endereco_usuario = JSON.parse(usuarioData.endereco_usuario);
				} catch {
					// Se não for JSON, manter como string
				}
			}
			setUsuario(usuarioData);
		} catch (err) {
			console.log("[AuthContext] Erro ao buscar usuário:", err);
			setUsuario(null);
		}
	};
		

	// Função para atualizar dados do usuário
	const atualizarUsuario = async (dados: any) => {
		try {
			if (!token) return false;
			const response = await axios.put(
				`${process.env.EXPO_PUBLIC_API_URL}/auth/editarusuario`,
				dados,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			// Atualiza o contexto com os dados mais recentes
			await fetchUsuario();
			return response.status === 200;
		} catch (err) {
			console.log("[AuthContext] Erro ao atualizar usuário:", err);
			return false;
		}
	};

	// Função para enviar/editar foto do usuário
	const enviarFotoUsuario = async (fotoBase64: string) => {
		try {
			if (!token) return null;
			const response = await axios.post(
				`${process.env.EXPO_PUBLIC_API_URL}/auth/uploadfoto`,
				{ fotoBase64 },
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await fetchUsuario();
			return response.data.url || null;
		} catch (err) {
			console.log("[AuthContext] Erro ao enviar foto:", err);
			return null;
		}
	};

	// Função para excluir foto do usuário
	const excluirFotoUsuario = async () => {
		try {
			if (!token) return false;
			const response = await axios.delete(
				`${process.env.EXPO_PUBLIC_API_URL}/auth/excluirfoto`,
				{
					headers: { Authorization: `Bearer ${token}` },
				}
			);
			await fetchUsuario();
			return response.status === 200;
		} catch (err) {
			console.log("[AuthContext] Erro ao excluir foto:", err);
			return false;
		}
	};

	return (
		<AuthContext.Provider value={{ usuario, setUsuario, loading, token, setToken, fetchUsuario, atualizarUsuario, enviarFotoUsuario, excluirFotoUsuario }}>
			{children}
		</AuthContext.Provider>
	);
};
