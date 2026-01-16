import React from "react";
import "../../layouts/CSS/toggleSwitch.css";
const ToggleSwitch = ({ isOn, onToggle }) => {
return (
<div className="toggle-container"> <label className="switch">
<input
type="checkbox"
checked={isOn}
onChange={onToggle}
/>
<span className="slider" />
</label>
<span className="toggle-label">
{isOn ? "Active" : "In-Active"}
</span>
</div>
);
};

export default ToggleSwitch;