import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const AddContact = ({ onAdd }) => {
  const [form, setForm] = useState({ name: "", email: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    onAdd(form);
    setForm({ name: "", email: "" });
  };

  return (
    <div style={{ marginBottom: "20px" }}>
      <div className="col-12">
        <TextField
          label="Name"
          name="name"
          value={form.name}
          
          className="form-control mt-2 mb-3 friend_invite_inputs"
          onChange={handleChange}
        />
      </div>

      <div className="col-12">
        <TextField
          label="Email"
          name="email"
          value={form.email}
          
          className="form-control mb-4 friend_invite_inputs"
          onChange={handleChange}
        />
      </div>

      <div className="col-8 mx-auto">
        <Button variant="contained" className="friend_invite_btn form-control" onClick={handleSubmit}>
          Invite
        </Button>
      </div>
    </div>
  );
};

export default AddContact;
