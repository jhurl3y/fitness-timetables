"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Event } from '../../lib/types';
import { days, HIIT_VENUE, HIIT_VENUE_MISSION } from '../../lib/constants';
import { convertTimeTo24Hour, getCurrentDateInPST, getDayWithTz } from '../../lib/time';
import { COLORS_TW } from "../../lib/constants";
import SkeletonLoader from './SkeletonLoader'; // Import the SkeletonLoader

type EventWithColor = Event & {
  color: keyof typeof COLORS_TW; // Use color keys from COLORS_TW
};

const currentDay = getDayWithTz(getCurrentDateInPST());

// Persistent color map to ensure consistent color assignment for each event type
const colorMap: { [key: string]: keyof typeof COLORS_TW } = {};

// Function to assign colors to events based on their type using COLORS_TW
function addColorToEvents(events: Event[]): EventWithColor[] {
  const availableColors = Object.keys(COLORS_TW) as (keyof typeof COLORS_TW)[];
  let colorIndex = 0;

  return events.map((event) => {
    if (!colorMap[event.type]) {
      colorMap[event.type] = availableColors[colorIndex % availableColors.length];
      colorIndex++;
    }

    return {
      ...event,
      color: colorMap[event.type], 
    };
  });
}

const COLORS = {
  blue: "bg-blue-100",
  red: "bg-red-100",
  green: "bg-green-100",
  yellow: "bg-yellow-100",
  purple: "bg-purple-100",
  pink: "bg-pink-100",
  indigo: "bg-indigo-100",
  gray: "bg-gray-100"
};

// Function to fetch timetable events
const fetchTimetableEvents = async () => {
  const res = await fetch('/api/timetable', { next: { revalidate: 3600 } });
  const { data } = await res.json();
  return data;
};

// Function to fetch HIIT events based on venue
const fetchHIITEvents = async (venue: string) => {
  const res = await fetch(`/api/hiit?venue_id=${venue}`, { next: { revalidate: 3600 } });
  const { data } = await res.json();
  return data;
};

const Timetable: React.FC = () => {
  const [events, setEvents] = useState<EventWithColor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVenue, setSelectedVenue] = useState<string>(HIIT_VENUE.toString()); // State to track selected venue
  const currentDayRef = useRef<HTMLDivElement | null>(null);

  const scrollToDay = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && currentDayRef.current) {
      currentDayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  };

  // Function to fetch and combine both timetable and HIIT events
  const fetchEvents = async (venue: string) => {
    setLoading(true);

    try {
      // Fetch timetable and HIIT events concurrently
      const [timetableEvents, hiitEvents] = await Promise.all([
        fetchTimetableEvents(),
        fetchHIITEvents(venue),
      ]);

      // Combine events from both sources
      const combinedEvents = [...timetableEvents, ...hiitEvents];

      // Assign colors to events
      setEvents(addColorToEvents(combinedEvents));
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(selectedVenue);
  }, [selectedVenue]); // Refetch data when selectedVenue changes

  useEffect(() => {
    if (events.length > 0) {
      scrollToDay();
    }
  }, [events]);

  const handleVenueChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedVenue(event.target.value); // Update the selected venue
  };

  if (loading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="p-4">
      {/* Dropdown to select venue */}
      <div className="mb-4">
        <label htmlFor="venue" className="font-semibold text-lg">Select Venue:</label>
        <select
          id="venue"
          value={selectedVenue}
          onChange={handleVenueChange}
          className="ml-2 p-2 border border-gray-300 rounded"
        >
          <option value={HIIT_VENUE}>HIIT Nob Hill</option>
          <option value={HIIT_VENUE_MISSION}>HIIT Mission</option>
        </select>
      </div>

      {/* Timetable grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {days.map((day, index) => (
          <div
            key={index}
            ref={index === currentDay ? currentDayRef : null}
            className={`border p-4 min-h-[150px] ${index === currentDay ? 'bg-cyan-100' : ''}`}
          >
            <h3 className="font-semibold text-lg sm:text-xl mb-4 text-gray-700">{day}</h3>
            <div className="space-y-4">
              {events
                .filter((event) => event.day === index)
                .sort((a, b) => convertTimeTo24Hour(a.time) - convertTimeTo24Hour(b.time))
                .map((event, i) => (
                  <div
                    key={i}
                    className={`${COLORS[event.color] || COLORS.blue} text-blue-800 p-3 rounded shadow-sm border border-gray-200 w-full break-words`}
                  >
                    <p className="font-medium text-lg">{event.title}</p>
                    <p className="text-sm">{event.time}</p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
