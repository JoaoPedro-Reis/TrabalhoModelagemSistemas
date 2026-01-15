import { useNavigate } from "react-router-dom";

const useFetch = () => {
  const navigate = useNavigate();
  const sendByFetch = async ({ url, body, authorization, verb }) => {
    try {
      const response = await fetch(url, {
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: authorization,
        },
        method: verb,
      });
      if (!response.ok) {
        alert(
          `Erro na requisição: ${response.status} - Usuário inválido ou desconectado`
        );
        navigate("/");
        return null;
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Erro na comunicação com o servidor: ${error.message}`);
    }
  };

  return { sendByFetch };
};

export default useFetch;
