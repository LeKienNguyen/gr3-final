import './TableContainer.css';

export const TableContainer = ({ headers = [], children, className = '' }) => (
  <div className={`table-container ${className}`}>
    <table className="table-container__table">
      {headers.length > 0 && (
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {children}
      </tbody>
    </table>
  </div>
);
