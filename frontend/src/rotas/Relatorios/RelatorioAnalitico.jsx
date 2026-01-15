import { useState, useEffect } from "react";
import useFetch from "../../components/useFetch";
import Table from "../../components/Table/Table";
import Input from "../../components/Input/Input";
import "./Relatorios.css";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

const RelatorioAnalitico = () => {
  const { sendByFetch } = useFetch();
  const [dados, setDados] = useState({
    nomeProd: "",
    nomeVendedor: "",
    dataVenda: "",
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

  const handleFiltro = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSuccessMessage("");
    try {
      setFetchData([]);
      const result = await sendByFetch({
        url: "/api/ProvaRefatora/PersisteTB/sp_consulta_prova_jp_relatorio_venda_analitica",
        body: {
          NOME_PRODUTO: dados.nomeProd,
          NOME_VENDEDOR: dados.nomeVendedor,
          DATA_VENDA: dados.dataVenda,
        },
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      const linha = result?.Linhas?.Linha || null;
      const array = linha ? (Array.isArray(linha) ? linha : [linha]) : [];
      if (result.length === 0) {
        setErrorMessage("Nenhum registro encontrado.");
      } else {
        setSuccessMessage("Consulta realizada com sucesso.");
        setFetchData(array);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    handleFiltro();
  }, []);

  return (
    <div className="container-relatorios">
      <BreadCrumb
        dados={[
          { path: "menu", label: "Menu" },
          { path: "relatorios-gerenciais", label: "Relatórios Gerenciais" },
          { path: "", label: "Relatório Analítico" },
        ]}
      />
      <div className="filtro-component">
        <h3>Filtros</h3>
        <form onSubmit={handleFiltro}>
          <Input
            name="nomeProd"
            labeltext="Produto"
            type="text"
            value={dados.nomeProd}
            handleChange={handleDadosChange}
          />
          <Input
            name="nomeVendedor"
            labeltext="Vendedor"
            type="text"
            value={dados.nomeVendedor}
            handleChange={handleDadosChange}
          />
          <Input
            name="dataVenda"
            labeltext="Data da Venda"
            type="text"
            value={dados.dataVenda}
            handleChange={handleDadosChange}
          />
          <button type="submit">Filtrar</button>
        </form>
      </div>

      <div className="table-message">
        <div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {successMessage && (
            <p className="success-message">{successMessage}</p>
          )}
        </div>
        <Table
          titulo={"Relatório Analítico de Vendas"}
          header={[
            { label: "Produto", prop: "NomeProduto" },
            { label: "Quantidade", prop: "QuantidadeVenda" },
            { label: "Valor Unitário", prop: "ValorUnitario" },
            { label: "Valor Total", prop: "ValorTotal" },
            { label: "Vendedor", prop: "NomeVendedor" },
            { label: "Data da Venda", prop: "DataVenda" },
          ]}
          dados={fetchData}
          className="table-component"
        />
      </div>
    </div>
  );
};

export default RelatorioAnalitico;
