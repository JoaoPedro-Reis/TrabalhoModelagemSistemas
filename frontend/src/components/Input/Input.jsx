/* eslint-disable react/prop-types */
import "./Input.css";

const Input = ({ name, labeltext, type, value, handleChange, max }) => {
  // Função para validar a entrada conforme o tipo de campo
  const handleInputChange = (e) => {
    let inputValue = e.target.value;

    if (name === "cpf") {
      inputValue = inputValue.replace(/\D/g, ""); // Remove caracteres não numéricos
    } else if (type === "text" && ["uf", "nome"].includes(name)) {
      inputValue = inputValue.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""); // Permite apenas letras e espaços
    }

    if (!max || inputValue.length <= max) {
      handleChange({ target: { name, value: inputValue } });
    }
  };

  return (
    <div className="form-group">
      <label htmlFor={name}>{labeltext}</label>
      <input
        id={name}
        placeholder="Digite aqui..."
        type={type}
        value={value}
        maxLength={max}
        onChange={handleInputChange}
        name={name}
      />
    </div>
  );
};

export default Input;
