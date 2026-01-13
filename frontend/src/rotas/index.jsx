import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import GerenciamentoVendedor from "./Vendedor/GerenciamentoVendedor";
import GerenciamentoProduto from "./Produtos/GerenciamentoProduto";
import GerenciamentoVenda from "./Venda/GerenciamentoVenda";
import RelatoriosGerenciais from "./Relatorios/RelatoriosGerenciais";
import RelatorioVendUf from "./Relatorios/RelatorioVendUf";
import RelatorioAnalitico from "./Relatorios/RelatorioAnalitico";
import RelatorioVendQtd from "./Relatorios/RelatorioVendQtd";
import RelatorioVendValor from "./Relatorios/RelatorioVendValor";

const Rotas = () => {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/menu", element: <Menu /> },
    { path: "/gerenciamento-vendedor", element: <GerenciamentoVendedor /> },
    { path: "/gerenciamento-produto", element: <GerenciamentoProduto /> },
    { path: "/gerenciamento-venda", element: <GerenciamentoVenda /> },
    //{ path: "/relatorios-gerenciais", element: <RelatoriosGerenciais /> },
    //{ path: "/relatorio-vendedores-por-uf", element: <RelatorioVendUf /> },
    //{ path: "/relatorio-analitico-venda", element: <RelatorioAnalitico /> },
    //{ path: "/relatorios-vendedor-por-qtd", element: <RelatorioVendQtd /> },
    // {
    //   path: "/relatorios-vendedor-por-valores",
    //   element: <RelatorioVendValor />,
    // },
  ];

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route key={index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default Rotas;
