import "./Select.css";
/* eslint-disable react/prop-types */
const Select = ({
  name,
  labeltext,
  value,
  handleChange,
  opcoes,
  itemValue,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{labeltext}</label>
      <select
        id={name}
        value={value}
        onChange={(e) => handleChange(e)}
        name={name}
      >
        <option value="">Selecione uma opção</option>
        {Array.isArray(opcoes) && opcoes.length > 0 ? (
          opcoes.map((item, index) => (
            <option key={index} value={item[itemValue]}>
              {item.NOME}
            </option>
          ))
        ) : (
          <option>Nenhum valor encontrado</option>
        )}
      </select>
    </div>
  );
};

export default Select;
