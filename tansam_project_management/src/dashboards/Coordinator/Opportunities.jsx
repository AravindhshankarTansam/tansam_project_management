import { useState } from "react";
import RichTextEditor from "../../components/RichTextEditor";
import "./CSS/Opportunities.css";

export default function Opportunities() {
  const [showModal, setShowModal] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [isPreview, setIsPreview] = useState(false);

  const [form, setForm] = useState({
    customerName: "",
    industry: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    leadSource: "",
    leadDescription: "",
    leadStatus: "NEW",
  });

  const resetForm = () => {
    setForm({
      customerName: "",
      industry: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      leadSource: "",
      leadDescription: "",
      leadStatus: "NEW",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setOpportunities([...opportunities, form]);
    resetForm();
    setShowModal(false);
  };

  return (
    <div className="opportunity-wrapper">
      <h2 className="opportunity-title">New Opportunities</h2>

      {/* ADD BUTTON */}
      <div className="opportunity-actions">
        <button onClick={() => setShowModal(true)}>
          + Add Opportunity
        </button>
      </div>

      {/* TABLE */}
      {opportunities.length > 0 && (
        <div className="opportunity-table-wrapper">
          <table className="opportunity-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((item, index) => (
                <tr key={index}>
                  <td>{item.customerName}</td>
                  <td>{item.industry}</td>
                  <td>{item.contactPerson}</td>
                  <td>{item.contactEmail}</td>
                  <td>{item.leadStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Add Opportunity</h3>

            <form onSubmit={handleSubmit} className="opportunity-form">
              <div className="form-group">
                <label>Customer Name</label>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Company Name</label>
                <input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Contact Person</label>
                <input
                  name="contactPerson"
                  value={form.contactPerson}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  name="contactPhone"
                  value={form.contactPhone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Source</label>
                <select
                  name="leadSource"
                  value={form.leadSource}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="WEBSITE">Website</option>
                  <option value="REFERRAL">Referral</option>
                  <option value="CALL">Call</option>
                  <option value="EMAIL">Email</option>
                </select>
              </div>

<div className="form-group full-width">
  <label>Description</label>

  {!isPreview ? (
    <RichTextEditor
      value={form.leadDescription}
      onChange={(value) =>
        setForm({ ...form, leadDescription: value })
      }
    />
  ) : (
    <div
      className="preview-content"
      dangerouslySetInnerHTML={{
        __html: form.leadDescription || "<p>No description</p>",
      }}
    />
  )}
</div>


              <div className="form-group">
                <label>Status</label>
                <select
                  name="leadStatus"
                  value={form.leadStatus}
                  onChange={handleChange}
                >
                  <option value="NEW">NEW</option>
                  <option value="EXISTING">Existing</option>
                </select>
              </div>

<div className="modal-actions">
  <button
    type="button"
    className="preview-btn"
    onClick={() => setIsPreview(!isPreview)}
  >
    {isPreview ? "Back to Edit" : "Preview"}
  </button>

  <button type="submit">Save</button>

  <button
    type="button"
    className="cancel-btn"
    onClick={() => {
      resetForm();
      setIsPreview(false);
      setShowModal(false);
    }}
  >
    Cancel
  </button>


</div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
