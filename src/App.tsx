import "cleave.js/dist/addons/cleave-phone.br.js";
import Cleave from "cleave.js/react";
import { useState } from "react";
import { z } from "zod";



const somenteNumeros = (str: string) => str.replace(/\D/g, "");

const schema = z
  .object({
    nome: z.string().min(1, "Nome é obrigatório"),
    email: z.string().email("E-mail inválido"),
    telefone: z
      .string()
      .transform((val) => somenteNumeros(val))
      .refine((val) => val.length === 11, "Telefone inválido"),
    senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });


export default function App() {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    senha: "",
    confirmarSenha: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors({});
    setSuccess(false);
  };


  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, telefone: e.target.value }));
    setErrors({});
    setSuccess(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = schema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const field = err.path[0];
        if (typeof field === "string") fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      setSuccess(false);
    } else {
      setSuccess(true);
      console.log("Usuário cadastrado:", result.data);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h2>Cadastro de Usuário</h2>

      {success && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          Cadastro realizado com sucesso!
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: 12 }}>
          <label>Nome:</label>
          <input
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            style={{ width: "100%", padding: 6, fontSize: 14 }}
          />
          {errors.nome && <p style={{ color: "red" }}>{errors.nome}</p>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>E-mail:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{ width: "100%", padding: 6, fontSize: 14 }}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Telefone:</label>
          <Cleave
            options={{ phone: true, phoneRegionCode: "BR" }}
            name="telefone"
            value={formData.telefone}
            onChange={handlePhoneChange}
            style={{ width: "100%", padding: 6, fontSize: 14 }}
          />
          {errors.telefone && <p style={{ color: "red" }}>{errors.telefone}</p>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Senha:</label>
          <input
            type="password"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            style={{ width: "100%", padding: 6, fontSize: 14 }}
          />
          {errors.senha && <p style={{ color: "red" }}>{errors.senha}</p>}
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Confirmar Senha:</label>
          <input
            type="password"
            name="confirmarSenha"
            value={formData.confirmarSenha}
            onChange={handleChange}
            style={{ width: "100%", padding: 6, fontSize: 14 }}
          />
          {errors.confirmarSenha && (
            <p style={{ color: "red" }}>{errors.confirmarSenha}</p>
          )}
        </div>

        <button
          type="submit"
          style={{
            padding: "8px 16px",
            fontSize: 16,
            backgroundColor: "#4caf50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Cadastrar
        </button>
      </form>
    </div>
  );
}
