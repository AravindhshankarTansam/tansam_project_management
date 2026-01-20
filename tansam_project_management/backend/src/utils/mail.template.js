export const assignedOpportunityTemplate = ({
  userName,
  opportunityId,
  opportunityName,
  customerName,
  stage,
  assignedBy,
  followUpDate,
}) => `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111">
    <h2 style="color:#0f4c81;">New Opportunity Assigned</h2>

    <p>Hello <b>${userName}</b>,</p>

    <p>
      You have been assigned a new business opportunity in
      <b>TANSAM Project Management System</b>.
    </p>

    <table cellpadding="8" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td><b>Opportunity ID</b></td>
        <td>${opportunityId}</td>
      </tr>
      <tr>
        <td><b>Opportunity Name</b></td>
        <td>${opportunityName}</td>
      </tr>
      <tr>
        <td><b>Client Name</b></td>
        <td>${customerName}</td>
      </tr>
      <tr>
        <td><b>Current Stage</b></td>
        <td>${stage}</td>
      </tr>
      ${
        followUpDate
          ? `<tr>
               <td><b>Next Follow-up</b></td>
               <td>${followUpDate}</td>
             </tr>`
          : ""
      }
      ${
        assignedBy
          ? `<tr>
               <td><b>Assigned By</b></td>
               <td>${assignedBy}</td>
             </tr>`
          : ""
      }
    </table>

    <p>
      Please log in to the PMS to review details and take necessary action.
    </p>

    <br />
    <p>Regards,<br /><b>${userName}</b></p>
  </div>
`;

export const unassignedOpportunityTemplate = ({
  userName,
  opportunityId,
  opportunityName,
  customerName,
  reassignedTo,
}) => `
  <div style="font-family: Arial, sans-serif; line-height:1.6">

    <h2>Opportunity Reassigned</h2>

    <p>Hello <b>${userName}</b>,</p>

    <p>
      The following opportunity has been reassigned to another team member.
    </p>

    <table cellpadding="8">
      <tr>
        <td><b>Opportunity ID</b></td>
        <td>${opportunityId}</td>
      </tr>
      <tr>
        <td><b>Opportunity</b></td>
        <td>${opportunityName}</td>
      </tr>
      <tr>
        <td><b>Client</b></td>
        <td>${customerName}</td>
      </tr>
      <tr>
        <td><b>Reassigned To</b></td>
        <td>${reassignedTo}</td>
      </tr>
    </table>

   <p>
      Please log in to the PMS to review details and take necessary action.
    </p>

    <br />
    <p>Regards,<br /><b>${userName}</b></p>

  
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
  startDate,
  endDate,
  projectId,
}) => `
  <div style="font-family: Arial, sans-serif; line-height:1.6; color:#111; max-width:600px; margin:0 auto;">
    <h2 style="color:#0f4c81; border-bottom:2px solid #0ea5e9; padding-bottom:8px;">
      New Project Assigned to You
    </h2>
    
    <p>Hello <b>${memberName}</b>,</p>
    
    <p>
      You have been assigned to a new project in <b>TANSAM Project Management System</b> by 
      <b>${assignedBy || "Team Lead"}</b>.
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

    <p style="margin-top:24px;">
      Please log in to the system to view full details and start contributing.
    </p>

    <p style="margin-top:30px; color:#475569;">
      Regards,<br/>
      <b>${assignedBy || "Team Lead"}</b><br/>
      TANSAM Project Management
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