import { useNavigate } from "react-router-dom";
import BreadCrumb from "../../components/BreadCrumb/BreadCrumb";

const RelatoriosGerenciais = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="container">
      <BreadCrumb
        dados={[
          { path: "menu", label: "Menu" },
          { path: "relatorios-gerenciais", label: "Relatórios Gerenciais" },
        ]}
      />
      <h1 className="title">Visualize seus relatórios</h1>
      <div className="button-group">
        <button
          onClick={() => handleNavigation("/relatorio-vendedores-por-UF")}
          className="bt-route-relatory"
        >
          Quantidade de Vendedores por UF
        </button>
        <button
          onClick={() => handleNavigation("/relatorio-analitico-venda")}
          className="bt-route-relatory"
        >
          Relatório Analítico de Venda
        </button>
        <button
          onClick={() => handleNavigation("/relatorios-vendedor-por-qtd")}
          className="bt-route-relatory"
        >
          Relatório de Vendedor por Quantidade
        </button>
        <button
          onClick={() => handleNavigation("/relatorios-vendedor-por-valores")}
          className="bt-route-relatory"
        >
          Relatório de Vendedor por Valores
        </button>
      </div>
    </div>
  );
};

export default RelatoriosGerenciais;
