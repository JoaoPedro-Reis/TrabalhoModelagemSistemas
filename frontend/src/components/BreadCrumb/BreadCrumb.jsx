import "./BreadCrumb.css";
import { useNavigate } from "react-router-dom";

const BreadCrumb = ({ dados = [] }) => {
  const navigate = useNavigate();

  return (
    <nav aria-label="Breadcrumb" className="breadcrumb">
      <ol>
        {dados.map((item, index) => (
          <li key={index}>
            {index === dados.length - 1 ? (
              <span aria-current="page">{item.label}</span>
            ) : (
              <a onClick={() => navigate(`/${item.path}`)}>{item.label}</a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default BreadCrumb;
