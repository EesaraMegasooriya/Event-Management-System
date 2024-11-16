import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Grid,
  Box,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';

interface Option {
  id: string;
  name: string;
}

function NewEvent(): React.ReactElement {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [dateTime, setDateTime] = useState<Dayjs | null>(null);
  const [venue, setVenue] = useState<string>('');
  const [eventType, setEventType] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('Scheduled');
  const [inviteType, setInviteType] = useState<string>('group');
  const [invitees, setInvitees] = useState<Option[]>([]);

  const [groups, setGroups] = useState<Option[]>([]);
  const [users, setUsers] = useState<Option[]>([]);

  // Fetch groups and users from backend
  useEffect(() => {
    const fetchGroupsAndUsers = async () => {
      try {
        const [groupRes, userRes] = await Promise.all([
          axios.get('http://localhost:5001/api/groups'), // Fetch groups
          axios.get('http://localhost:5001/api/users'), // Fetch users
        ]);

        // Map group and user data into a consistent format
        setGroups(groupRes.data.map((group: any) => ({ id: group.groupCode, name: group.groupName })));
        setUsers(userRes.data.map((user: any) => ({ id: user.userId, name: user.userName })));
      } catch (error) {
        console.error('Error fetching groups or users:', error);
      }
    };

    fetchGroupsAndUsers();
  }, []);

  const handleSubmit = async () => {
    if (!title || !dateTime || !eventType || !inviteType || invitees.length === 0) {
      alert('Please fill in all required fields.');
      return;
    }

    const data = {
      title,
      description,
      dateTime: dateTime?.toISOString(),
      venue,
      eventType,
      isPublic,
      status,
      inviteType,
      invitees,
    };

    try {
      const response = await axios.post('http://localhost:5001/api/events', data);
      alert('Event created successfully!');
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleInviteeChange = (selectedIds: string[]) => {
    const selectedOptions = (inviteType === 'group' ? groups : users).filter((option) =>
      selectedIds.includes(option.id)
    );
    setInvitees(selectedOptions);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
        Add New Event
      </Typography>

      <Grid container spacing={2}>
        {/* Event Title */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Event Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>

        {/* Description */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={4}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>

        {/* Date and Time Picker */}
        <Grid item xs={12}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Date & Time"
              value={dateTime}
              onChange={(newValue) => setDateTime(newValue)}
            />
          </LocalizationProvider>
        </Grid>

        {/* Venue */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Venue"
            multiline
            rows={2}
            variant="outlined"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
          />
        </Grid>

        {/* Event Type */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Event Type</InputLabel>
            <Select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              label="Event Type"
            >
              <MenuItem value="Conference">Conference</MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
              <MenuItem value="Seminar">Seminar</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Invite Type */}
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormLabel component="legend">Invite by</FormLabel>
            <RadioGroup
              row
              value={inviteType}
              onChange={(e) => setInviteType(e.target.value)}
            >
              <FormControlLabel value="group" control={<Radio />} label="Group" />
              <FormControlLabel value="individual" control={<Radio />} label="Individual" />
            </RadioGroup>
          </FormControl>
        </Grid>

        {/* Invitees */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>{inviteType === 'group' ? 'Select Groups' : 'Select Users'}</InputLabel>
            <Select
              multiple
              value={invitees.map((option) => option.id)}
              onChange={(e) => handleInviteeChange(e.target.value as string[])}
              renderValue={(selected) =>
                selected
                  .map((id) => (inviteType === 'group' ? groups : users).find((option) => option.id === id)?.name)
                  .join(', ')
              }
            >
              {(inviteType === 'group' ? groups : users).map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            fullWidth
            variant="contained"
            endIcon={<SendIcon />}
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default NewEvent;
