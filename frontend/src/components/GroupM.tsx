import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Event as BigCalendarEvent } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Box, Typography } from '@mui/material';

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
}

function GroupM(): React.ReactElement {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get<Event[]>('http://localhost:5001/api/events');
        // Format the events for the calendar
        const formattedEvents: CalendarEvent[] = response.data.map((event) => ({
          id: event._id,
          title: `${event.title} (${event.status})`,
          start: new Date(event.dateTime),
          end: new Date(new Date(event.dateTime).getTime() + 2 * 60 * 60 * 1000), // Assume 2-hour duration
          venue: event.venue,
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
    <Box sx={{ maxWidth: '1000px', mx: 'auto', p: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Event valendar
      </Typography>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        popup
        onSelectEvent={(event) =>
          alert(`Event: ${event.title}\nVenue: ${event.venue}`)
        }
      />
    </Box>
  );
}

export default GroupM;
