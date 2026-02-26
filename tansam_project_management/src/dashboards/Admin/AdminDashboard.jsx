import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import {
  AdminPanelSettings,
  Biotech,
  Layers,
  WorkOutline,
  PeopleAlt,
  Apartment,
} from "@mui/icons-material";
import { fetchAdminDashboardCounts } from "../../services/admin/admin.roles.api";
import "./admincss/AdminDashboard.css";

const StatCard = ({ title, total, active, inactive, icon }) => {
  return (
    <Card className="siemens-card">
      <CardContent className="siemens-card-content">
        <Box className="siemens-card-header">
          <Box className="siemens-icon">{icon}</Box>
          <Typography className="siemens-title">{title}</Typography>
        </Box>

        <Typography className="siemens-total">{total}</Typography>

        <Box className="siemens-status">
          <div className="status-box active-box">
            <span className="status-label">Active</span>
            <span className="status-count">{active}</span>
          </div>

          <div className="status-box inactive-box">
            <span className="status-label">Inactive</span>
            <span className="status-count">{inactive}</span>
          </div>
        </Box>
      </CardContent>
    </Card>
  );
};

const AdminDashboard = () => {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const data = await fetchAdminDashboardCounts();
        setCounts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);

  if (loading) {
    return (
      <Box className="siemens-loader">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="siemens-dashboard">
      {/* <Box className="siemens-header">
        <Typography className="siemens-main-title">
          Admin Overview
        </Typography>
        <Typography className="siemens-subtitle">
          System Statistics & Management Summary
        </Typography>
      </Box> */}

      <Grid container spacing={4}>
        {/* 3 per row */}
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard title="Roles" {...counts.roles} icon={<AdminPanelSettings />} />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <StatCard title="Labs" {...counts.labs} icon={<Biotech />} />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <StatCard title="Project Types" {...counts.projectTypes} icon={<Layers />} />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <StatCard title="Client Types" {...counts.clientTypes} icon={<Apartment />} />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <StatCard title="Work Categories" {...counts.workCategories} icon={<WorkOutline />} />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <StatCard title="Users" {...counts.users} icon={<PeopleAlt />} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;