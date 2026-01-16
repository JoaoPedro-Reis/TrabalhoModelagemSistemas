import { useState } from "react";
import "./CadastroVendedor.css";
import useFetch from "../../components/useFetch";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

const CadastroVendedor = () => {
  const { sendByFetch } = useFetch();
  const [dados, setDados] = useState({ nome: "", email: "", telefone: "" });
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
    if (!dados.nome || !dados.email || !dados.telefone) {
      return "Todos os campos são obrigatórios.";
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
        url: "/api/StokFlow/AcessaBD/sp_stokflow_persistencia_vendedor",
        body: {
          NOME: dados.nome,
          EMAIL: dados.email,
          TELEFONE: dados.telefone,
        },
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
        url: "/api/StokFlow/AcessaBD/sp_stokflow_consulta_vendedor",
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
          name="email"
          labeltext="Email:"
          type="text"
          value={dados.email ?? ""}
          max={1000}
          handleChange={handleDadosChange}
        />
        <Input
          name="telefone"
          labeltext="TELEFONE:"
          type="text"
          value={dados.telefone ?? ""}
          max={11}
          handleChange={handleDadosChange}
        />
        <button onClick={handleCadastro}>Cadastrar</button>
      </div>
      <div className="tabelaConsulta">
        <Table
          header={[
            { label: "Nome", prop: "NOME" },
            { label: "Email", prop: "EMAIL" },
            { label: "Telefone", prop: "TELEFONE" },
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
