import { MoreVertical } from "lucide-react";

const UniversityRow = ({
  id,
  name,
  location,
  rep,
  status,
  onAssignClick,
}: any) => (
  <tr>
    <td><strong>{name}</strong></td>
    <td>{location}</td>

    <td>
      {rep === "Assign Representative" ? (
        <button
          className="assign-btn"
          onClick={() => onAssignClick(id, name)}
        >
          Assign +
        </button>
      ) : (
        <span>{rep}</span>
      )}
    </td>

    <td>
      <span className={`status-pill ${status.toLowerCase()}`}>
        {status}
      </span>
    </td>

    <td>
      <MoreVertical size={18} color="#ccc" />
    </td>
  </tr>
);

export default UniversityRow;