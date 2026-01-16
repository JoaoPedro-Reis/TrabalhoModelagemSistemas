import { useState, useEffect } from "react";
import useFetch from "../../components/useFetch";
import Table from "../../components/Table/Table";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

const RelatorioVendValor = () => {
  const { sendByFetch } = useFetch();
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchData, setFetchData] = useState([]);

  const handleConsulta = async () => {
    setErrorMessage("");
    try {
      setFetchData([]);
      const result = await sendByFetch({
        url: "/api/StokFlow/AcessaBD/sp_stokflow_consulta_relatorio_vendedor_valor",
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      let linhas = result.Linhas?.Linha || [];
      if (!Array.isArray(linhas)) {
        linhas = [linhas];
      }
      if (result.length === 0) {
        setErrorMessage("Nenhum registro encontrado.");
      } else {
        setFetchData(linhas);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    handleConsulta();
  }, []);

  return (
    <div className="table_component">
      <BreadCrumb
        dados={[
          { path: "menu", label: "Menu" },
          { path: "relatorios-gerenciais", label: "Relatórios Gerenciais" },
          { path: "", label: "Relatório Vendedor-Valor" },
        ]}
      />
      <div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <Table
        titulo={"Vendedor por Valores"}
        header={[
          { label: "Vendedor", prop: "NomeVendedor" },
          { label: "Quantidade Vendida", prop: "QuantidadeVenda" },
          { label: "Valor Total", prop: "ValorTotal" },
        ]}
        dados={fetchData}
      />
    </div>
  );
};

export default RelatorioVendValor;
