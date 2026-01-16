import { useState } from "react";
import useFetch from "../../components/useFetch";
import "./GerenciamentoProduto.css";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

const GerenciamentoProduto = () => {
  const { sendByFetch } = useFetch();
  const [dados, setDados] = useState({
    idProd: "",
    nome: "",
    categoria: "",
    quantidade: "",
    valUnitario: "",
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
    if (
      !dados.nome ||
      !dados.categoria ||
      !dados.quantidade ||
      !dados.valUnitario
    ) {
      return "Todos os campos são obrigatórios.";
    }
    if (parseInt(dados.quantidade) < 0) {
      return "A quantidade deve ser positiva.";
    }
    if (parseInt(dados.valUnitario) < 0) {
      return "Valor unitário deve ser positivo.";
    }
    return null;
  };

  const handleSelectProd = (item) => {
    setDados({
      idProd: item.ID_PRODUTO || "",
      nome: item.NOME || "",
      categoria: item.CATEGORIA || "",
      quantidade: item.QUANTIDADE || "",
      valUnitario: item.VAL_UNITARIO || "",
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
        url: "/api/StokFlow/AcessaBD/sp_stokflow_persistencia_produto",
        body: {
          NOME: dados.nome,
          CATEGORIA: dados.categoria,
          QUANTIDADE: dados.quantidade,
          VAL_UNITARIO: dados.valUnitario,
          INATIVO: dados.inativo,
        },
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      if (result.Resposta.Status == 500) {
        setErrorMessage("Não é possível cadastrar produtos com o mesmo nome");
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
        url: "/api/StokFlow/AcessaBD/sp_stokflow_consulta_produto",
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
    if (!dados.idProd) {
      setErrorMessage("Selecione um item para deletar!");
      return;
    }
    try {
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_deletar_produto",
        body: { ID_PRODUTO: dados.idProd },
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
    if (!dados.idProd) {
      setErrorMessage("Selecione um item para editar!");
      return;
    }
    try {
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_editar_produto",
        body: {
          ID_PRODUTO: dados.idProd,
          CATEGORIA: dados.categoria,
          QUANTIDADE: dados.quantidade,
          VAL_UNITARIO: dados.valUnitario,
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
          { path: "", label: "Gerenciamento de Produtos" },
        ]}
      />
      <div className="cadastros">
        <h1>Cadastro de Produto</h1>

        <Input
          name="nome"
          labeltext="Nome:"
          type="text"
          value={dados.nome ?? ""}
          handleChange={handleDadosChange}
        />
        <Input
          name="categoria"
          labeltext="Categoria:"
          type="text"
          value={dados.categoria ?? ""}
          handleChange={handleDadosChange}
        />
        <Input
          name="quantidade"
          labeltext="Quantidade:"
          type="number"
          value={dados.quantidade ?? ""}
          handleChange={handleDadosChange}
        />
        <Input
          name="valUnitario"
          labeltext="Valor Unitário:"
          type="number"
          value={dados.valUnitario ?? ""}
          handleChange={handleDadosChange}
        />
        <button onClick={handleCadastro}>Cadastrar</button>
        <button onClick={handleUpdate}>Editar</button>
      </div>
      <div className="tabelaConsulta">
        <Table
          header={[
            { label: "Codigo", prop: "ID_PRODUTO" },
            { label: "Nome", prop: "NOME" },
            { label: "Categoria", prop: "CATEGORIA" },
            { label: "Quantidade", prop: "QUANTIDADE" },
            { label: "Valor Unitário", prop: "VAL_UNITARIO" },
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

export default GerenciamentoProduto;
