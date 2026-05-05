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
