import "./Table.css";

// eslint-disable-next-line react/prop-types
const Table = ({ header = [], dados = [], handleDoubleClick, titulo }) => {
  return (
    <div className="container">
      <table>
        <thead>
          <caption>{titulo}</caption>
          <tr>
            {header?.map((headerItem, index) => (
              <th key={index} scope="col">
                {headerItem.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(dados) && dados.length > 0 ? (
            dados?.map((item, index) => (
              <tr
                key={index}
                onDoubleClick={() =>
                  handleDoubleClick && handleDoubleClick(item)
                }
              >
                {header?.map((headerItem, index) => (
                  <td key={index}>{item[headerItem.prop]}</td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={header.length}>Nenhum registro encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
