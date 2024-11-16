import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  Grid,
  TextField,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Event {
  _id: string;
  title: string;
  dateTime: string;
  venue: string;
  eventType: string;
  description: string;
  isPublic: boolean;
  status: string;
}

const EventTable: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get<Event[]>('http://localhost:5001/api/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      await axios.delete(`http://localhost:5001/api/events/${id}`);
      alert('Event deleted successfully!');
      setEvents(events.filter((event) => event._id !== id));
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete the event. Please try again.');
    }
  };

  const handleViewEdit = (event: Event, action: 'view' | 'edit') => {
    setSelectedEvent(event);
    setModalOpen(true);

    if (action === 'view') {
      navigate('/calendar');
    }
  };

  const handleSave = async () => {
    if (!selectedEvent) return;

    try {
      const { _id, title, dateTime, venue, eventType, description } = selectedEvent;
      await axios.put(`http://localhost:5001/api/events/${_id}`, {
        title,
        dateTime,
        venue,
        eventType,
        description,
      });
      alert('Event updated successfully!');
      setModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update the event. Please try again.');
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Events Dashboard
      </Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="event table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Event Title</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Venue</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Event Type</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event._id}>
                <TableCell>{event.title}</TableCell>
                <TableCell>{new Date(event.dateTime).toLocaleString()}</TableCell>
                <TableCell>{event.venue}</TableCell>
                <TableCell>
                  <Chip
                    label={event.eventType}
                    color={
                      event.eventType === 'Conference'
                        ? 'primary'
                        : event.eventType === 'Workshop'
                        ? 'secondary'
                        : 'success'
                    }
                  />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleViewEdit(event, 'view')}
                    startIcon={<VisibilityIcon />}
                  >
                    View
                  </Button>
                  <Button
                    onClick={() => handleViewEdit(event, 'edit')}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                  <Button
                    color="error"
                    onClick={() => handleDelete(event._id)}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal for Viewing/Editing */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 500,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          {selectedEvent && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedEvent.title}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Title"
                    value={selectedEvent.title}
                    onChange={(e) =>
                      setSelectedEvent({ ...selectedEvent, title: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    value={selectedEvent.description}
                    multiline
                    rows={4}
                    onChange={(e) =>
                      setSelectedEvent({ ...selectedEvent, description: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Venue"
                    value={selectedEvent.venue}
                    onChange={(e) =>
                      setSelectedEvent({ ...selectedEvent, venue: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Date & Time"
                    value={selectedEvent.dateTime}
                    onChange={(e) =>
                      setSelectedEvent({ ...selectedEvent, dateTime: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Event Type"
                    value={selectedEvent.eventType}
                    onChange={(e) =>
                      setSelectedEvent({ ...selectedEvent, eventType: e.target.value })
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button fullWidth variant="contained" onClick={handleSave}>
                    Save
                  </Button>
                </Grid>
              </Grid>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default EventTable;
