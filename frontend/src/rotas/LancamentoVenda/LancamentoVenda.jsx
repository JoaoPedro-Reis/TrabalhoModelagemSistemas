import { useState, useEffect, useRef } from "react";
import useFetch from "../../components/useFetch";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import Select from "../../components/Select/Select";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

const LancamentoVenda = () => {
  const { sendByFetch } = useFetch();
  const [dados, setDados] = useState({
    idVenda: "",
    produto: "",
    qtd: "",
    vendedor: "",
  });
  const [options, setOptions] = useState({
    produtos: [],
    vendedores: [],
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
    if (!dados.produto || !dados.qtd || !dados.vendedor) {
      return "Todos os campos são obrigatórios.";
    }
    if (dados.qtd <= 0) {
      return "A quantidade deve ser maior que zero.";
    }
    return null;
  };

  const getProduto = async () => {
    try {
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_consulta_produto",
        verb: "POST",
      });
      let linhas = result.Linhas?.Linha || [];
      if (!Array.isArray(linhas)) {
        linhas = [linhas];
      }
      setOptions((prevState) => ({ ...prevState, produtos: linhas }));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const getVendedor = async () => {
    try {
      setFetchData([]);
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_consulta_vendedor",
        verb: "POST",
      });
      let linhas = result.Linhas?.Linha || [];
      if (!Array.isArray(linhas)) {
        linhas = [linhas];
      }
      setOptions((prevState) => ({
        ...prevState,
        vendedores: linhas,
      }));
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleConsultaBt = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    try {
      setFetchData([]);
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_consulta_toda_venda",
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
      console.log("Dados da venda:", linhas);
      setFetchData(linhas);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    getProduto();
    getVendedor();
    handleConsultaBt();
  }, []);

  const handleCadastroBt = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    try {
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_persistencia_venda",
        body: {
          ID_PRODUTO: dados.produto,
          ID_VENDEDOR: dados.vendedor,
          QUANTIDADE_VENDA: dados.qtd,
        },
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      setSuccessMessage("Cadastro realizado com sucesso!");
      console.log(result);
      setDados({
        idVenda: "",
        produto: "",
        qtd: "",
        vendedor: "",
      });
      await handleConsultaBt();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleSelectVenda = (item) => {
    console.log("Item selecionado:", item);

    // Encontrar o ID do produto pelo nome
    const produtoEncontrado = options.produtos.find(
      (p) => p.NOME === item.NomeProduto
    );
    const idProduto = produtoEncontrado ? produtoEncontrado.ID_PRODUTO : "";

    // Encontrar o ID do vendedor pelo nome
    const vendedorEncontrado = options.vendedores.find(
      (v) => v.NOME === item.NomeVendedor
    );
    const idVendedor = vendedorEncontrado ? vendedorEncontrado.ID_VENDEDOR : "";

    setDados({
      idVenda: item.IdVenda || "",
      produto: idProduto || "",
      qtd: item.QuantidadeVenda || "",
      vendedor: idVendedor || "",
    });
  };

  const handleDelete = async () => {
    setErrorMessage("");
    setSuccessMessage("");
    if (!dados.idVenda) {
      setErrorMessage("Selecione uma venda para deletar!");
      return;
    }
    try {
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_deletar_venda",
        body: { ID_VENDA: dados.idVenda },
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      setSuccessMessage("Deleção realizada com sucesso!");
      console.log(result);
      setDados({
        idVenda: "",
        produto: "",
        qtd: "",
        vendedor: "",
      });
      await handleConsultaBt();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="container">
      <BreadCrumb
        dados={[
          { path: "menu", label: "Menu" },
          { path: "", label: "Lançamento de Vendas" },
        ]}
      />
      <div className="cadastros">
        <h1>Lançamento de Vendas</h1>
        <Select
          name="produto"
          labeltext="Produto:"
          value={dados.produto ?? ""}
          handleChange={handleDadosChange}
          opcoes={options.produtos}
          itemValue="ID_PRODUTO"
        />
        <Input
          name="qtd"
          labeltext="Quantidade:"
          type="number"
          value={dados.qtd ?? ""}
          handleChange={handleDadosChange}
        />
        <Select
          name="vendedor"
          labeltext="Vendedor:"
          value={dados.vendedor ?? ""}
          handleChange={handleDadosChange}
          opcoes={options.vendedores}
          itemValue="ID_VENDEDOR"
        />
        <button onClick={handleCadastroBt}>Cadastrar</button>
      </div>
      <div className="tabelaConsulta">
        <Table
          header={[
            { label: "Id Venda", prop: "IdVenda" },
            { label: "Vendedor", prop: "NomeVendedor" },
            { label: "Produto", prop: "NomeProduto" },
            { label: "Quantidade", prop: "QuantidadeVenda" },
            { label: "Data", prop: "DataVenda" },
          ]}
          dados={fetchData}
          handleDoubleClick={handleSelectVenda}
        />
        <div className="bts-table">
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

export default LancamentoVenda;
