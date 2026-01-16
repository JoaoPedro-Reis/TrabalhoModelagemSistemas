import { useNavigate } from "react-router-dom";
import "./Home.css";
import Input from "../../components/Input/Input";
import useFetch from "../../components/useFetch";
import { useState } from "react";

const Home = () => {
  const [dados, setDados] = useState({ user: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const { sendByFetch } = useFetch();
  const navigate = useNavigate();

  const handleDadosChange = ({ target }) => {
    const { name, value } = target;
    setDados((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!dados.user || !dados.password) {
      return "Todos os campos são obrigatórios.";
    }
    return null;
  };

  const handleLogin = async () => {
    setErrorMsg("");
    const validationError = validateForm();
    if (validationError) {
      setErrorMsg(validationError);
      return;
    }
    try {
      const result = await sendByFetch({
        url: "api/Login/Login",
        authorization: "Basic " + btoa(`${dados.user}:${dados.password}`),
        verb: "GET",
      });
      if (!result || !result.token) {
        setErrorMsg("Dados invalidos!");
        return;
      }
      console.log("json", result);
      localStorage.setItem("jwt", result.token);
      navigate("/menu");
    } catch (error) {
      setErrorMsg("Erro no login. Tente novamente");
      console.log(error.message);
    }
  };

return (
  <div className="container-login">
    <div className="cadastros">
      <h1 className="title">Login</h1>

      <div className="error-message">{errorMsg}</div>

      <Input
        name="user"
        labeltext="Usuario:"
        type="text"
        value={dados.user}
        handleChange={handleDadosChange}
      />

      <Input
        name="password"
        labeltext="Senha:"
        type="password"
        value={dados.password}
        handleChange={handleDadosChange}
      />

      <button onClick={handleLogin} className="bt-login">
        Entrar
      </button>
    </div>
  </div>
);

};

export default Home;
