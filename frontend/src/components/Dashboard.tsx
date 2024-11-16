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
  Box,
  Typography,
  Chip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2'; // Import SweetAlert2
import axios from 'axios';

interface Participant {
  id: string;
  name: string;
}

interface Event {
  _id: string;
  title: string;
  dateTime: string;
  venue: string;
  eventType: string;
  status: string;
  inviteType: string;
  invitees: Participant[];
}

const Dashboard: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
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
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch events!',
      });
    }
  };

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5001/api/events/${id}`);
          setEvents(events.filter((event) => event._id !== id));
          Swal.fire('Deleted!', 'The event has been deleted.', 'success');
        } catch (error) {
          console.error('Error deleting event:', error);
          Swal.fire('Error!', 'Failed to delete the event.', 'error');
        }
      }
    });
  };

  const handleEdit = (event: Event) => {
    Swal.fire({
      title: 'Edit Event',
      text: `You are editing "${event.title}"`,
      icon: 'info',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Proceed',
    }).then(() => {
      navigate('/add-event', { state: { event } });
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex flex-col items-center justify-center text-white">
      <div className="text-4xl font-extrabold text-center pt-10">Event Management Dashboard</div>
      <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 4 }}>
        <TableContainer component={Paper} sx={{ mt: 4 }}>
          <Table sx={{ minWidth: 650 }} aria-label="event table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Event Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Venue</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Event Type</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
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
                  <TableCell>{event.status}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleEdit(event)} startIcon={<EditIcon />}>
                      Edit
                    </Button>
                    <Button color="error" onClick={() => handleDelete(event._id)} startIcon={<DeleteIcon />}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </div>
  );
};

export default Dashboard;
