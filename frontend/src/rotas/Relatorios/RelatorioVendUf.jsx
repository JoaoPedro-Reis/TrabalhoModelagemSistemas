import { useState, useEffect } from "react";
import "./Relatorios.css";
import useFetch from "../../components/useFetch";
import Table from "../../components/Table/Table";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

const RelatorioVendUf = () => {
  const { sendByFetch } = useFetch();
  const [errorMessage, setErrorMessage] = useState("");
  const [fetchData, setFetchData] = useState([]);

  const handleConsulta = async () => {
    setErrorMessage("");
    try {
      setFetchData([]);
      const result = await sendByFetch({
        url: "/api/ProvaRefatora/PersisteTB/sp_consulta_prova_jp_vendedor",
        authorization: "Bearer " + localStorage.getItem("jwt"),
        verb: "POST",
      });
      let linhas = result.Linhas?.Linha || [];
      if (!Array.isArray(linhas)) {
        linhas = [linhas];
      }
      const contadorUf = {};

      for (let i = 0; i < linhas.length; i++) {
        const uf = linhas[i].UF;
        if (uf) {
          if (!contadorUf[uf]) {
            contadorUf[uf] = 1;
          } else {
            contadorUf[uf]++;
          }
        }
      }
      //transforma em array pra fazer o map
      const juntaDados = [];
      for (const uf in contadorUf) {
        juntaDados.push({ UF: uf, Quantidade: contadorUf[uf] });
      }
      if (result.length === 0) {
        setErrorMessage("Nenhum registro encontrado.");
      } else {
        setFetchData(juntaDados);
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  useEffect(() => {
    handleConsulta();
  }, []);

  return (
    <div className="table-component">
      <BreadCrumb
        dados={[
          { path: "menu", label: "Menu" },
          { path: "relatorios-gerenciais", label: "Relatórios Gerenciais" },
          { path: "", label: "Relatório Vendedor-Uf" },
        ]}
      />
      <div>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <Table
        titulo={"Quantidade de Vendedores por UF"}
        header={[
          { label: "UF", prop: "UF" },
          { label: "Quantidade", prop: "Quantidade" },
        ]}
        dados={fetchData}
      />
    </div>
  );
};

export default RelatorioVendUf;
