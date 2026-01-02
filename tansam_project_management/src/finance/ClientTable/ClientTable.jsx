import StatusBadge from "../StatusBadge/StatusBadge.jsx"; // Optional: if you want to show status badges
import "../ClientTable/ClientTable.css";
export default function ClientTable({ clients }) {
  return (
    <div className="card p-4 shadow-md rounded-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th>QuotationNO</th>
            <th>Client</th>
            <th>Type</th>
            <th>Category</th>
            <th>Quote</th>
            <th>Response</th>
            <th>Last Follow-up</th>
            <th>Remarks</th>
            <th>Status</th>
            <th>Next Follow-up</th>
          </tr>
        </thead>

        <tbody>
          {clients && clients.length > 0 ? (
            clients.map((c, i) => (
              <tr key={i} className="border-t">
                <td>{c.quotationNo}</td>
                <td>{c.clientName}</td>
                <td>{c.clientType || c.companyName}</td>
                <td>{c.workType}</td>
                <td>{c.quoteValue}</td>
                <td>{c.clientResponse}</td>
                <td>{c.lastFollowUp}</td>
                <td>{c.remarks}</td>
                <td>
                  {/* Optional: render a badge */}
                  {c.orderStatus ? <StatusBadge status={c.orderStatus} /> : ""}
                </td>
                <td>{c.nextFollowUp}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={10} className="text-center py-4">
                No clients available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
