import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event as BigCalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';

interface Event {
  _id: string;
  title: string;
  dateTime: string;
  venue: string;
  eventType: string;
  status: string;
}

interface CalendarEvent extends BigCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  venue: string;
  eventType: string;
  status: string;
}

// Define the API base URL dynamically
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://em-events-802d77926c0b.herokuapp.com';

function GroupM(): React.ReactElement {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if screen size is small

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<Event[]>(`${API_BASE_URL}/api/events`);
        // Format the events for the calendar
        const formattedEvents: CalendarEvent[] = response.data.map((event) => ({
          id: event._id,
          title: `${event.title} (${event.status})`,
          start: new Date(event.dateTime),
          end: new Date(new Date(event.dateTime).getTime() + 2 * 60 * 60 * 1000), // Assume 2-hour duration
          venue: event.venue,
          eventType: event.eventType,
          status: event.status,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Localizer for react-big-calendar
  const localizer = momentLocalizer(moment);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex flex-col items-center justify-center">
      <Box
        sx={{
          maxWidth: isMobile ? '95%' : '1000px',
          mx: 'auto',
          p: 2,
          backgroundImage: "url('https://source.unsplash.com/featured/?calendar')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            background: 'rgba(0, 0, 0, 0.5)',
            color: 'white',
            borderRadius: 2,
            p: 1,
            fontSize: isMobile ? '1.5rem' : '2rem', // Adjust font size for mobile
          }}
        >
          Event Calendar
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            href="/add-event"
            size={isMobile ? 'small' : 'medium'} // Adjust button size for mobile
          >
            Create Event
          </Button>
        </Box>
        <Box
          sx={{
            background: 'rgba(255, 255, 255, 0.8)',
            borderRadius: 2,
            overflow: 'hidden',
            p: 2,
          }}
        >
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: isMobile ? 400 : 500 }} // Adjust calendar height for mobile
            popup
            onSelectEvent={(event) => {
              alert(`Event: ${event.title}\nVenue: ${event.venue}\nType: ${event.eventType}`);
            }}
            eventPropGetter={(event) => {
              const backgroundColor =
                event.status === 'Scheduled'
                  ? '#3f51b5'
                  : event.status === 'On Going'
                  ? '#4caf50'
                  : event.status === 'Postpone'
                  ? '#ff9800'
                  : '#f44336'; // Default color for Cancelled
              return { style: { backgroundColor, color: 'white' } };
            }}
            tooltipAccessor={(event) => `${event.title} - ${event.venue}`}
          />
        </Box>
      </Box>
    </div>
  );
}

export default GroupM;
