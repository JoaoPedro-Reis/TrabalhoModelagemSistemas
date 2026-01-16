import { Routes, Route } from "react-router-dom";
import Home from "./Home/Home";
import Menu from "./Menu/Menu";
import CadastroVendedor from "./CadastroVendedor/CadastroVendedor";
import GerenciamentoProduto from "./GerenciamentoProdutos/GerenciamentoProduto";
import Categoria from "./GerenciamentoCategoria/Categoria";
import LancamentoVenda from "./LancamentoVenda/LancamentoVenda";
import RelatoriosGerenciais from "./Relatorios/RelatoriosGerenciais";
import RelatorioAnalitico from "./Relatorios/RelatorioAnalitico";
import RelatorioVendQtd from "./Relatorios/RelatorioVendQtd";
import RelatorioVendValor from "./Relatorios/RelatorioVendValor";

const Rotas = () => {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/menu", element: <Menu /> },
    { path: "/cadastro-vendedor", element: <CadastroVendedor /> },
    { path: "/gerenciamento-produtos", element: <GerenciamentoProduto /> },
    { path: "/gerenciamento-categoria", element: <Categoria /> },
    { path: "/lancamento-venda", element: <LancamentoVenda /> },
    { path: "/relatorios-gerenciais", element: <RelatoriosGerenciais /> },
    { path: "/relatorio-analitico-venda", element: <RelatorioAnalitico /> },
    { path: "/relatorios-vendedor-por-qtd", element: <RelatorioVendQtd /> },
    {
      path: "/relatorios-vendedor-por-valores",
      element: <RelatorioVendValor />,
    },
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
