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
    descricao: "",
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
      !dados.descricao ||
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
      descricao: item.DESCRICAO || "",
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
        url: "/api/ProvaRefatora/PersisteTB/sp_persistencia_prova_jp_produto",
        body: {
          NOME: dados.nome,
          DESCRICAO: dados.descricao,
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
        url: "/api/ProvaRefatora/PersisteTB/sp_consulta_prova_jp_produto",
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
        url: "/api/ProvaRefatora/PersisteTB/sp_deletar_prova_jp_produto",
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
        url: "/api/ProvaRefatora/PersisteTB/sp_editar_prova_jp_produto",
        body: {
          ID_PRODUTO: dados.idProd,
          DESCRICAO: dados.descricao,
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
          name="descricao"
          labeltext="Descrição:"
          type="text"
          value={dados.descricao ?? ""}
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
            { label: "Nome", prop: "NOME" },
            { label: "Descrição", prop: "DESCRICAO" },
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
