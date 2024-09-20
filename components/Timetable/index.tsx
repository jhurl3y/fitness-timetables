"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Event } from '../../lib/types';
import { days } from '../../lib/constants';
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
  const availableColors = Object.keys(COLORS_TW) as (keyof typeof COLORS_TW)[]; // Get available color keys
  let colorIndex = 0;

  return events.map((event) => {
    // Assign a unique color to each event type if not already assigned
    if (!colorMap[event.type]) {
      colorMap[event.type] = availableColors[colorIndex % availableColors.length];
      colorIndex++;
    }

    return {
      ...event,
      color: colorMap[event.type], // Use the stored color for this event type
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

const Timetable: React.FC = () => {
  const [events, setEvents] = useState<EventWithColor[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const currentDayRef = useRef<HTMLDivElement | null>(null);

  const scrollToDay = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile && currentDayRef.current) {
      currentDayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/timetable', { next: { revalidate: 3600 } });
      const { data } = await res.json();

      setEvents(addColorToEvents(data)); // Assign colors consistently
      setLoading(false); // Stop loading once events are fetched
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      scrollToDay();
    }
  }, [events]);

  if (loading) {
    return <SkeletonLoader />; // Show skeleton loader while loading
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4">
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
  );
};

export default Timetable;
