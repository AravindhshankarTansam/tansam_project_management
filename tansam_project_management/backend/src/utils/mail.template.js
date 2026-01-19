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
