/* ===============================
   OPPORTUNITY MAIL TEMPLATES
================================ */

export const assignedOpportunityTemplate = ({
  userName,
  opportunityId,
  opportunityName,
  clientName,
  stage,
  assignedBy,
  followUpDate,
  contactPerson,
  contactEmail,
  contactPhone,
}) => `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:20px;">
    <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- HEADER -->
      <div style="background:#0f4c81; padding:16px;">
        <h2 style="color:#ffffff; margin:0; font-size:20px;">
          New Opportunity Assigned
        </h2>
      </div>

      <!-- BODY -->
      <div style="padding:20px; color:#111;">
        <p style="margin-top:0;">
          Hello <b>${userName}</b>,
        </p>

        <p>
          You have been assigned a new business opportunity in
          <b>TANSAM Project Management System</b>.
        </p>

        <!-- OPPORTUNITY DETAILS -->
        <h3 style="font-size:15px; color:#0f4c81; border-bottom:1px solid #e5e7eb; padding-bottom:6px;">
          Opportunity Details
        </h3>

        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
          <tr>
            <td style="color:#475569;"><b>Opportunity ID</b></td>
            <td>${opportunityId}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="color:#475569;"><b>Opportunity Name</b></td>
            <td>${opportunityName}</td>
          </tr>
          <tr>
            <td style="color:#475569;"><b>Client Name</b></td>
            <td>${clientName}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="color:#475569;"><b>Stage</b></td>
            <td>
              <span style="background:#e0f2fe; color:#0369a1; padding:4px 8px; border-radius:12px; font-size:12px;">
                ${stage}
              </span>
            </td>
          </tr>
        </table>

        <!-- CONTACT DETAILS -->
        <h3 style="font-size:15px; color:#0f4c81; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin-top:20px;">
          Client Contact Details
        </h3>

        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
          <tr>
            <td style="color:#475569;"><b>Contact Person</b></td>
            <td>${contactPerson || "—"}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="color:#475569;"><b>Email</b></td>
            <td>
              ${
                contactEmail
                  ? `<a href="mailto:${contactEmail}" style="color:#0f4c81; text-decoration:none;">${contactEmail}</a>`
                  : "—"
              }
            </td>
          </tr>
          <tr>
            <td style="color:#475569;"><b>Phone</b></td>
            <td>${contactPhone || "—"}</td>
          </tr>
        </table>

        ${
          followUpDate
            ? `
            <h3 style="font-size:15px; color:#0f4c81; border-bottom:1px solid #e5e7eb; padding-bottom:6px; margin-top:20px;">
              Follow-up
            </h3>
            <p style="font-size:14px; margin:8px 0;">
              <b>Next Follow-up Date:</b> ${followUpDate}
            </p>
            `
            : ""
        }

        <p style="margin-top:24px;">
          Please log in to the PMS to review details and take necessary action.
        </p>

        <p style="margin-top:24px;">
          Regards,<br/>
          <b>${assignedBy}</b>
        </p>
      </div>

      <!-- FOOTER -->
      <div style="background:#f8fafc; padding:12px; text-align:center; font-size:12px; color:#64748b;">
        © ${new Date().getFullYear()} TANSAM Project Management System
      </div>

    </div>
  </div>
`;

export const unassignedOpportunityTemplate = ({
  userName,
  opportunityId,
  opportunityName,
  clientName,
  reassignedTo,
}) => `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:20px;">
    <div style="max-width:620px; margin:auto; background:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <div style="background:#dc2626; padding:16px;">
        <h2 style="color:#ffffff; margin:0; font-size:20px;">
          Opportunity Reassigned
        </h2>
      </div>

      <div style="padding:20px; color:#111;">
        <p>Hello <b>${userName}</b>,</p>

        <p>
          The following opportunity has been reassigned to another team member.
        </p>

        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
          <tr>
            <td style="color:#475569;"><b>Opportunity ID</b></td>
            <td>${opportunityId}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="color:#475569;"><b>Opportunity</b></td>
            <td>${opportunityName}</td>
          </tr>
          <tr>
            <td style="color:#475569;"><b>Client</b></td>
            <td>${clientName}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="color:#475569;"><b>Reassigned To</b></td>
            <td>${reassignedTo}</td>
          </tr>
        </table>

        <p style="margin-top:24px;">
          Regards,<br/>
          <b>${userName}</b>
        </p>
      </div>

      <div style="background:#f8fafc; padding:12px; text-align:center; font-size:12px; color:#64748b;">
        © ${new Date().getFullYear()} TANSAM Project Management System
      </div>

    </div>
  </div>
`;

export const opportunityContactUpdatedTemplate = ({
  userName,
  opportunityId,
  opportunityName,
  clientName,
  assignedBy,

  oldContact = {},
  newContact = {},
}) => `
  <div style="font-family: Arial, Helvetica, sans-serif; background:#f4f6f8; padding:20px;">
    <div style="max-width:640px; margin:auto; background:#ffffff; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.08); overflow:hidden;">

      <!-- HEADER -->
      <div style="background:#0f4c81; padding:16px;">
        <h2 style="color:#ffffff; margin:0; font-size:20px;">
          Opportunity Contact Details Updated
        </h2>
      </div>

      <div style="padding:20px; color:#111;">
        <p>Hello <b>${userName}</b>,</p>

        <p>
          Contact details for the following opportunity have been updated.
        </p>

        <!-- OPPORTUNITY -->
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
          <tr>
            <td style="color:#475569;"><b>Opportunity</b></td>
            <td>${opportunityName}</td>
          </tr>
          <tr style="background:#f9fafb;">
            <td style="color:#475569;"><b>Client</b></td>
            <td>${clientName}</td>
          </tr>
          <tr>
            <td style="color:#475569;"><b>Opportunity ID</b></td>
            <td>${opportunityId}</td>
          </tr>
        </table>

        <!-- DIFF TABLE -->
        <h3 style="margin-top:20px; font-size:15px; color:#0f4c81;">
          Changed Contact Details
        </h3>

        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse:collapse; font-size:14px;">
          <tr style="background:#f1f5f9;">
            <th align="left">Field</th>
            <th align="left">Previous</th>
            <th align="left">Updated</th>
          </tr>

          ${
            oldContact.contactPerson !== newContact.contactPerson
              ? `
              <tr>
                <td>Contact Person</td>
                <td>${oldContact.contactPerson || "—"}</td>
                <td style="color:#16a34a;"><b>${newContact.contactPerson || "—"}</b></td>
              </tr>`
              : ""
          }

          ${
            oldContact.contactEmail !== newContact.contactEmail
              ? `
              <tr style="background:#f9fafb;">
                <td>Email</td>
                <td>${oldContact.contactEmail || "—"}</td>
                <td style="color:#16a34a;"><b>${newContact.contactEmail || "—"}</b></td>
              </tr>`
              : ""
          }

          ${
            oldContact.contactPhone !== newContact.contactPhone
              ? `
              <tr>
                <td>Phone</td>
                <td>${oldContact.contactPhone || "—"}</td>
                <td style="color:#16a34a;"><b>${newContact.contactPhone || "—"}</b></td>
              </tr>`
              : ""
          }
        </table>

        <p style="margin-top:24px;">
          Updated by <b>${assignedBy}</b>
        </p>
      </div>

      <div style="background:#f8fafc; padding:12px; text-align:center; font-size:12px; color:#64748b;">
        © ${new Date().getFullYear()} TANSAM Project Management System
      </div>
    </div>
  </div>
`;


// mail.template.js (add at the end)

/**
 * Template when Team Lead assigns a project to a team member
 */
export const assignedProjectTeamTemplate = ({
  memberName,
  projectName,
  projectType,
  clientName,
  assignedBy,
  assignedByEmail,
  startDate,
  endDate,
  projectId,
}) => `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111; max-width:600px; margin:0 auto;">

    <!-- LOGO -->
   

    <h2 style="color:#0f4c81; border-bottom:2px solid #0ea5e9; padding-bottom:8px;">
      New Project Assigned
    </h2>

    <p>Hello <b>${memberName}</b>,</p>

    <p>
      You have been assigned to a new project in 
      <b>TANSAM Project Management System</b>.
    </p>

    <table cellpadding="10" cellspacing="0" style="border-collapse:collapse; width:100%; margin:20px 0;">
      <tr style="background:#f1f5f9;">
        <td><b>Project Name</b></td>
        <td>${projectName}</td>
      </tr>
      <tr>
        <td><b>Project Type</b></td>
        <td>${projectType}</td>
      </tr>
      <tr style="background:#f1f5f9;">
        <td><b>Client</b></td>
        <td>${clientName}</td>
      </tr>
      <tr>
        <td><b>Start Date</b></td>
        <td>${startDate || "—"}</td>
      </tr>
      <tr style="background:#f1f5f9;">
        <td><b>End Date</b></td>
        <td>${endDate || "—"}</td>
      </tr>
      <tr>
        <td><b>Project ID</b></td>
        <td>${projectId}</td>
      </tr>
    </table>

    <p>
      Please log in to the PMS dashboard to view full details and start working on this project.
    </p>

    <p style="margin-top:30px; color:#475569;">
      Regards,<br/>
      <b>${assignedBy || "Team Lead"}</b><br/>
      ${assignedByEmail || ""}<br/>
      <b>TANSAM Project Management</b>
    </p>
  </div>
`;


/**
 * Template to share Client Contact Details with assigned team member
 */
export const clientDetailsTeamTemplate = ({
  memberName,
  projectName,
  clientName,
  contactPerson,
  contactEmail,
  contactPhone,
  assignedBy,
}) => `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111; max-width:600px; margin:0 auto;">
    <h2 style="color:#0f4c81; border-bottom:2px solid #0ea5e9; padding-bottom:8px;">
      Client Contact Details – ${projectName}
    </h2>
    
    <p>Hello <b>${memberName}</b>,</p>
    
    <p>
      Here are the contact details of the client for the project you are assigned to:
    </p>

    <table cellpadding="10" cellspacing="0" style="border-collapse:collapse; width:100%; margin:20px 0;">
      <tr style="background:#f1f5f9;">
        <td><b>Client Name</b></td>
        <td>${clientName}</td>
      </tr>
      <tr>
        <td><b>Contact Person</b></td>
        <td>${contactPerson || "—"}</td>
      </tr>
      <tr style="background:#f1f5f9;">
        <td><b>Email</b></td>
        <td><a href="mailto:${contactEmail}">${contactEmail || "—"}</a></td>
      </tr>
      <tr>
        <td><b>Phone</b></td>
        <td>${contactPhone || "—"}</td>
      </tr>
    </table>

    <p style="margin-top:24px; color:#475569;">
      Use this information responsibly and only for project-related communication.
    </p>

    <p style="margin-top:30px;">
      Regards,<br/>
      <b>${assignedBy || "Team Lead"}</b>
    </p>
  </div>
`;