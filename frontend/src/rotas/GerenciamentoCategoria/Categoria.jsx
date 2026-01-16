import { useState } from "react";
import useFetch from "../../components/useFetch";
import "./GerenciamentoProduto.css";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

const Categoria = () => {
  const { sendByFetch } = useFetch();
  const [dados, setDados] = useState({
    idCategoria: "",
    nome: "",
    descricao: "",
    inativo: 0,
  });

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
    if (!dados.nome || !dados.descricao) {
      return "Todos os campos são obrigatórios.";
    }
    return null;
  };

  const handleSelectProd = (item) => {
    setDados({
      idCategoria: item.ID_CATEGORIA || "",
      nome: item.NOME || "",
      descricao: item.DESCRICAO || "",
      inativo: item.INATIVO ?? 0,
    });
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
        url: "/api/StokFlow/AcessaBD/sp_stokflow_persistencia_categoria",
        body: {
          NOME: dados.nome,
          DESCRICAO: dados.descricao,
          INATIVO: dados.inativo,
        },
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      if (result.Resposta.Status == 500) {
        setErrorMessage("Não é possível cadastrar categorias com o mesmo nome");
        return;
      }
      setSuccessMessage("Cadastro realizado com sucesso!");
      console.log(result);
      setDados({});
      await handleConsulta();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleConsulta = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      setFetchData([]);
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_consulta_categoria",
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      let linhas = result.Linhas?.Linha || [];
      if (!Array.isArray(linhas)) {
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

  const handleDelete = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!dados.idCategoria) {
      setErrorMessage("Selecione um item para deletar!");
      return;
    }
    try {
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_deletar_categoria",
        body: { ID_CATEGORIA: dados.idCategoria },
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      setSuccessMessage("Deleção realizada com sucesso!");
      console.log(result);
      setDados({});
      await handleConsulta();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleUpdate = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!dados.idCategoria) {
      setErrorMessage("Selecione um item para editar!");
      return;
    }
    try {
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_editar_categoria",
        body: {
          ID_CATEGORIA: dados.idCategoria,
          NOME: dados.nome,
          DESCRICAO: dados.descricao,
          INATIVO: dados.inativo,
        },
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      setSuccessMessage("Edição realizada com sucesso!");
      console.log(result);
      setDados({});
      await handleConsulta();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <BreadCrumb
        dados={[
          { path: "menu", label: "Menu" },
          { path: "", label: "Gerenciamento de Categorias" },
        ]}
      />
      <div className="cadastros">
        <h1>Cadastro de Categoria</h1>

        <Input
          name="nome"
          labeltext="Nome:"
          type="text"
          value={dados.nome ?? ""}
          handleChange={handleDadosChange}
        />
        <Input
          name="descricao"
          labeltext="Descrição:"
          type="text"
          value={dados.descricao ?? ""}
          handleChange={handleDadosChange}
        />
        <button onClick={handleCadastro}>Cadastrar</button>
        <button onClick={handleUpdate}>Editar</button>
      </div>
      <div className="tabelaConsulta">
        <Table
          header={[
            { label: "Codigo", prop: "ID_CATEGORIA" },
            { label: "Nome", prop: "NOME" },
            { label: "Descrição", prop: "DESCRICAO" },
            { label: "Inativo", prop: "INATIVO" },
          ]}
          dados={fetchData}
          handleDoubleClick={handleSelectProd}
        />
        <div className="bts-table">
          <button onClick={handleConsulta}>Consultar</button>
          <button className="bt-deletar" onClick={handleDelete}>
            Deletar
          </button>
        </div>
        {errorMessage && <div className="error-message">{errorMessage}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Categoria;
