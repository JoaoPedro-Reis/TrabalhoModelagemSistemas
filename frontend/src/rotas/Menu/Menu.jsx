import { useNavigate } from "react-router-dom";
import "./Menu.css";
import logo from "../../assets/StokFlow_logo.png";

const Menu = () => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="menu-container">
      <div className="menu-exit">
        <button
          onClick={() => handleNavigation("/")}
          className="bt-exit"
          title="Sair"
        >
          ← Sair
        </button>
      </div>
      <div className="container">
        <h1 className="title">Menu Principal</h1>
        <img src={logo} alt="StokFlow Logo" className="menu-logo" />
        <div className="button-group">
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
            onClick={() => handleNavigation("/gerenciamento-categoria")}
            className="bt-route"
          >
            Gerenciar Categoria
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
    </div>
  );
};

export default Menu;
