import { useState } from "react";
import "./CadastroVendedor.css";
import useFetch from "../../components/useFetch";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

const CadastroVendedor = () => {
  const { sendByFetch } = useFetch();
  const [dados, setDados] = useState({ nome: "", uf: "", cpf: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fetchData, setFetchData] = useState([]);

  const handleDadosChange = ({ target }) => {
    const { name, value } = target;
    setDados((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!dados.nome || !dados.uf || !dados.cpf) {
      return "Todos os campos são obrigatórios.";
    }
    if (dados.uf.length !== 2) {
      return "UF deve conter 2 letras.";
    }
    if (dados.cpf.length !== 11) {
      return "CPF deve conter exatamente 11 dígitos.";
    }
    return null;
  };

  const handleCadastro = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    try {
      const result = await sendByFetch({
        url: "/api/ProvaRefatora/PersisteTB/sp_persistencia_prova_jp_vendedor",
        body: { NOME: dados.nome, UF: dados.uf.toUpperCase(), CPF: dados.cpf },
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      if (result.Resposta.Status == 500) {
        setErrorMessage("Não é possível cadastrar vendedores com o mesmo CPF");
        return;
      }
      setSuccessMessage("Cadastro realizado com sucesso!");
      console.log(result);
      setDados({});
      await handleConsulta();
    } catch (error) {
      setErrorMessage("Erro na operação");
      console.log(error.message);
    }
  };

  const handleConsulta = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      setFetchData([]);
      const result = await sendByFetch({
        url: "/api/ProvaRefatora/PersisteTB/sp_consulta_prova_jp_vendedor",
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      let linhas = result.Linhas?.Linha || [];
      if (!Array.isArray(linhas)) {
        // Se for um único objeto, transforma em um array
        linhas = [linhas];
      }
      if (linhas.length === 0) {
        setErrorMessage("Nenhum registro encontrado.");
      } else {
        setSuccessMessage("Consulta realizada com sucesso.");
      }
      setFetchData(linhas);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <BreadCrumb
        dados={[
          { path: "menu", label: "Menu" },
          { path: "", label: "Cadastro de Vendedor" },
        ]}
      />
      <div className="cadastros">
        <h1>Cadastro de Vendedor</h1>
        <Input
          name="nome"
          labeltext="Nome:"
          type="text"
          value={dados.nome ?? ""}
          max={1000}
          handleChange={handleDadosChange}
        />
        <Input
          name="uf"
          labeltext="UF:"
          type="text"
          value={dados.uf ?? ""}
          max={2}
          handleChange={handleDadosChange}
        />
        <Input
          name="cpf"
          labeltext="CPF:"
          type="text"
          value={dados.cpf ?? ""}
          max={11}
          handleChange={handleDadosChange}
        />
        <button onClick={handleCadastro}>Cadastrar</button>
      </div>
      <div className="tabelaConsulta">
        <Table
          header={[
            { label: "Nome", prop: "NOME" },
            { label: "UF", prop: "UF" },
            { label: "CPF", prop: "CPF" },
          ]}
          dados={fetchData}
        />
        <button onClick={handleConsulta}>Consultar</button>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default CadastroVendedor;
