import { useNavigate } from "react-router-dom";
import "./Menu.css";

const Menu = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
      <div className="container">
        <h1 className="title">Menu Principal</h1>
        <div className="button-group">
          <button onClick={() => handleNavigation("/")} className="bt-route">
            home
          </button>
          <button
            onClick={() => handleNavigation("/cadastro-vendedor")}
            className="bt-route"
          >
            Cadastro de Vendedor
          </button>
          <button
            onClick={() => handleNavigation("/gerenciamento-produtos")}
            className="bt-route"
          >
            Gerenciamento de Produtos
          </button>
          <button
            onClick={() => handleNavigation("/lancamento-venda")}
            className="bt-route"
          >
            Lançamento de Venda
          </button>
          <button
            onClick={() => handleNavigation("/relatorios-gerenciais")}
            className="bt-route"
          >
            Relatórios Gerenciais
          </button>
        </div>
      </div>
  );
};

export default Menu;
