export type CalendarEvent = {
  id: string;
  summary: string;
  description?: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
};

export const fetchEvents = async (token: string, timeMin: string, timeMax: string): Promise<CalendarEvent[]> => {
  try {
    const url = new URL('https://www.googleapis.com/calendar/v3/calendars/primary/events');
    url.searchParams.append('timeMin', timeMin);
    url.searchParams.append('timeMax', timeMax);
    url.searchParams.append('singleEvents', 'true');
    url.searchParams.append('orderBy', 'startTime');
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error("Failed to fetch events", await response.text());
      return [];
    }

    const data = await response.json();
    return data.items || [];
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error);
    return [];
  }
};
export const createGoogleEvent = async (token: string, eventData: any): Promise<any> => {
  try {
    const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      console.error("Failed to create event", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating Google Calendar event:", error);
    return null;
  }
};
export const updateGoogleEvent = async (token: string, eventId: string, eventData: any): Promise<any> => {
  try {
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
    });

    if (!response.ok) {
      console.error("Failed to update event", await response.text());
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating Google Calendar event:", error);
    return null;
  }
};

export const deleteGoogleEvent = async (token: string, eventId: string): Promise<boolean> => {
  try {
    const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      console.error("Failed to delete event", await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting Google Calendar event:", error);
    return false;
  }
};
