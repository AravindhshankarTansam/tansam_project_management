import { useEffect, useState } from "react";
import RichTextEditor from "../../components/RichTextEditor";
import {
  fetchOpportunities,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} from "../../services/coordinator/coordinator.opportunity.api";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import "./CSS/Opportunities.css";

export default function Opportunities() {
  const [showModal, setShowModal] = useState(false);
  const [opportunities, setOpportunities] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  // Track expanded descriptions
  const [expandedRows, setExpandedRows] = useState({});

  const [form, setForm] = useState({
    opportunity_id: null,
    opportunityName: "",
    customerName: "",
    industry: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    leadSource: "",
    leadDescription: "",
    leadStatus: "NEW",
  });

  /* ================= LOAD ================= */
  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    try {
      setLoading(true);
      const data = await fetchOpportunities();
      setOpportunities(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ================= HANDLERS ================= */

  const resetForm = () => {
    setForm({
      opportunity_id: null,
      opportunityName: "",
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

  const openAddModal = () => {
    setIsEdit(false);
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (row) => {
    setIsEdit(true);
    setForm({
      opportunity_id: row.opportunity_id,
      opportunityName: row.opportunity_name,
      customerName: row.customer_name,
      industry: row.company_name || "",
      contactPerson: row.contact_person || "",
      contactEmail: row.contact_email || "",
      contactPhone: row.contact_phone || "",
      leadSource: row.lead_source || "",
      leadDescription: row.lead_description || "",
      leadStatus: row.lead_status,
    });
    setShowModal(true);
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateOpportunity(form.opportunity_id, form);
      } else {
        await createOpportunity(form);
      }
      setShowModal(false);
      setIsPreview(false);
      resetForm();
      loadOpportunities();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this opportunity?")) return;
    try {
      await deleteOpportunity(id);
      loadOpportunities();
    } catch (err) {
      alert(err.message);
    }
  };

  const toggleDescription = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  /* ================= UI ================= */

  return (
    <div className="opportunity-wrapper">
      <h2 className="opportunity-title">New Opportunities</h2>

      <div className="opportunity-actions">
        <button onClick={openAddModal}>+ Add Opportunity</button>
      </div>

      <div className="opportunity-table-wrapper">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="opportunity-table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Opportunity ID</th>
                <th>Opportunity</th>
                <th>Customer</th>
                <th>Company</th>
                <th>Contact Person</th>
                <th>Contact Email</th>
                <th>Contact Phone</th>
                <th>Source</th>
                <th>Description</th>
                <th>Status</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {opportunities.length === 0 ? (
                <tr>
                  <td colSpan={12} className="empty">
                    No opportunities found
                  </td>
                </tr>
              ) : (
                opportunities.map((item, index) => {
                  const isExpanded = expandedRows[item.opportunity_id];
                  const hasLongDesc =
                    item.lead_description &&
                    item.lead_description.length > 80;

                  return (
                    <tr key={item.opportunity_id}>
                      <td>{index + 1}</td>
                      <td>{item.opportunity_id}</td>
                      <td>{item.opportunity_name}</td>
                      <td>{item.customer_name}</td>
                      <td>{item.company_name}</td>
                      <td>{item.contact_person || "-"}</td>
                      <td>{item.contact_email || "-"}</td>
                      <td>{item.contact_phone || "-"}</td>
                      <td>{item.lead_source || "-"}</td>

                      <td>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: item.lead_description
                              ? isExpanded
                                ? item.lead_description
                                : item.lead_description.slice(0, 80) +
                                  (hasLongDesc ? "..." : "")
                              : "<em>No description</em>",
                          }}
                        />
                        {hasLongDesc && (
                          <button
                            className="view-link"
                            onClick={() =>
                              toggleDescription(item.opportunity_id)
                            }
                          >
                            {isExpanded ? "Read less" : "Read more"}
                          </button>
                        )}
                      </td>

                      <td>
                        <span
                          className={`status ${item.lead_status.toLowerCase()}`}
                        >
                          {item.lead_status}
                        </span>
                      </td>

                      <td className="actions">
                        <button
                          className="icon-btn edit"
                          onClick={() => openEditModal(item)}
                        >
                          <FiEdit />
                        </button>
                        <button
                          className="icon-btn delete"
                          onClick={() =>
                            handleDelete(item.opportunity_id)
                          }
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>{isEdit ? "Edit Opportunity" : "Add Opportunity"}</h3>

            <form onSubmit={handleSubmit} className="opportunity-form">
              <div className="form-group">
                <label>Opportunity Name</label>
                <input
                  name="opportunityName"
                  value={form.opportunityName}
                  onChange={handleChange}
                  required
                />
              </div>

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

              <div className="form-group status-field">
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

              <div className="form-group full-width description-field">
                <label>Description</label>

                {!isPreview ? (
                  <RichTextEditor
                    value={form.leadDescription}
                    onChange={(v) =>
                      setForm({ ...form, leadDescription: v })
                    }
                  />
                ) : (
                  <div
                    className="preview-content"
                    dangerouslySetInnerHTML={{
                      __html:
                        form.leadDescription || "<p>No description</p>",
                    }}
                  />
                )}
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
