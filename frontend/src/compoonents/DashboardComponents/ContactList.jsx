import React from "react";
import { Avatar, List, ListItem, ListItemText, ListItemAvatar, Typography } from "@mui/material";
import '../../index.css';

const ContactList = ({ contacts }) => {
  return (
    <List className="contact-list">
      {contacts.map((c) => (
        <ListItem key={c.id} alignItems="flex-start" className="contact-list-item">
          <ListItemAvatar>
            <Avatar className="contact-avatar">{c.name.charAt(0).toUpperCase()}</Avatar>
          </ListItemAvatar>
          <ListItemText
            className="contact-list-item-text"
            primary={<Typography variant="subtitle1">{c.name}</Typography>}
            secondary={c.email}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default ContactList;