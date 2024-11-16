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
import { useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

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
  const navigate = useNavigate();
  const routerLocation = useLocation();

  useEffect(() => {
    const fetchGroupsAndUsers = async () => {
      try {
        const [groupRes, userRes] = await Promise.all([
          axios.get('http://localhost:5001/api/groups'),
          axios.get('http://localhost:5001/api/users'),
        ]);

        setGroups(groupRes.data.map((group: any) => ({ id: group.groupCode, name: group.groupName })));
        setUsers(userRes.data.map((user: any) => ({ id: user.userId, name: user.userName })));
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch groups or users.',
        });
      }
    };

    fetchGroupsAndUsers();

    if (routerLocation.state?.event) {
      const event = routerLocation.state.event;

      setTitle(event.title);
      setDescription(event.description);
      setDateTime(event.dateTime ? dayjs(event.dateTime) : null);
      setVenue(event.venue);
      setEventType(event.eventType);
      setIsPublic(event.isPublic);
      setStatus(event.status);
      setInviteType(event.inviteType);
      setInvitees(event.invitees.map((invitee: any) => ({ id: invitee.id, name: invitee.name })));
    }
  }, [routerLocation.state]);

  const handleSubmit = async () => {
    if (!title || !dateTime || !venue || invitees.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Fields',
        text: 'Please fill in all required fields (Event Title, Date & Time, Venue, Invitees).',
      });
      return;
    }

    if (dateTime && dayjs().isAfter(dateTime)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid Date',
        text: 'Event Date & Time cannot be in the past.',
      });
      return;
    }

    const eventData = {
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
      if (routerLocation.state?.event) {
        const eventId = routerLocation.state.event._id;
        await axios.put(`http://localhost:5001/api/events/${eventId}`, eventData);
        Swal.fire({
          icon: 'success',
          title: 'Event Updated',
          text: 'The event has been successfully updated!',
        });
      } else {
        await axios.post('http://localhost:5001/api/events', eventData);
        Swal.fire({
          icon: 'success',
          title: 'Event Created',
          text: 'The event has been successfully created!',
        });
      }

      navigate('/dashboard');
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Submission Failed',
        text: 'An error occurred while submitting the event. Please try again.',
      });
    }
  };

  const handleInviteeChange = (selectedIds: string[]) => {
    const selectedOptions = (inviteType === 'group' ? groups : users).filter((option) =>
      selectedIds.includes(option.id)
    );
    setInvitees(selectedOptions);
  };

  return (
    <div className="pt-11 pb-11 min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex flex-col items-center justify-center">
      <Box sx={{ maxWidth: 600, mx: 'auto', p: 4, boxShadow: 3, borderRadius: 2, bgcolor: 'background.paper' }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          {routerLocation.state?.event ? 'Edit Event' : 'Add New Event'}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Event Title"
              variant="outlined"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              error={!title}
              helperText={!title ? 'Event Title is required' : ''}
            />
          </Grid>

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

          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Select Date & Time"
                value={dateTime}
                onChange={(newValue) => setDateTime(newValue)}
                disablePast
                slotProps={{
                  textField: { required: true, error: !dateTime, helperText: !dateTime ? 'Date & Time is required' : '' },
                }}
              />
            </LocalizationProvider>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Venue"
              multiline
              rows={2}
              variant="outlined"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              required
              error={!venue}
              helperText={!venue ? 'Venue is required' : ''}
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Event Type</InputLabel>
              <Select value={eventType} onChange={(e) => setEventType(e.target.value)} label="Event Type">
                <MenuItem value="Conference">Conference</MenuItem>
                <MenuItem value="Workshop">Workshop</MenuItem>
                <MenuItem value="Seminar">Seminar</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <FormControlLabel
              control={<Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />}
              label="Is this a public event?"
            />
          </Grid>

          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="On Going">On Going</MenuItem>
                <MenuItem value="Postpone">Postpone</MenuItem>
                <MenuItem value="Cancel">Cancel</MenuItem>
              </Select>
            </FormControl>
          </Grid>

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

          <Grid item xs={12}>
            <Button
              fullWidth
              variant="contained"
              endIcon={<SendIcon />}
              sx={{ mt: 2 }}
              onClick={handleSubmit}
            >
              {routerLocation.state?.event ? 'Update Event' : 'Create Event'}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}

export default NewEvent;
