"use client";
import React, { useEffect, useState, useRef } from 'react';
import { Event } from '../../lib/types';
import { days } from '../../lib/constants';
import { convertTimeTo24Hour } from '../../lib/time';
import { getRandomTailwindBgClass } from "../../lib/utils";
import { COLORS_TW, TIMEZONE } from "../../lib/constants";

function getCurrentDayInPST(): number {
  const pstDate = new Date(
    new Intl.DateTimeFormat("en-US", { timeZone: TIMEZONE }).format(new Date())
  );
  const day = pstDate.getDay(); // Sunday = 0, Monday = 1, etc.

  // Adjust so that Monday = 0, ..., Sunday = 6
  return (day === 0) ? 6 : day - 1;
}


type EventWithColor = Event & {
  color: keyof typeof COLORS_TW; // Use color keys from COLORS_TW
};

// Function to assign colors to events based on their type
function addColorToEvents(events: Event[]): EventWithColor[] {
  const colorMap: { [key: string]: keyof typeof COLORS_TW } = {}; // A map to store the color for each event type

  return events.map((event) => {
    // If the event type doesn't have a color yet, assign a random one
    if (!colorMap[event.type]) {
      colorMap[event.type] = getRandomTailwindBgClass();
    }

    // Return the event with the assigned color based on its type
    return {
      ...event,
      color: colorMap[event.type], // Use color key from COLORS_TW
    };
  });
}

// TODO: need to fix have to repeat
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
  const currentDayRef = useRef<HTMLDivElement | null>(null); // Ref for the current day

  const scrollToDay = () => {
    // Check if the device is mobile based on screen width (you can adjust the width as per your needs)
    const isMobile = window.innerWidth <= 768; // 768px is a common breakpoint for mobile devices
  
    // Scroll to the current day only on mobile
    if (isMobile && currentDayRef.current) {
      currentDayRef.current.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/timetable', { next: { revalidate: 3600 } });
      const { data } = await res.json();
      setEvents(addColorToEvents(data));
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0){
      scrollToDay();
    }
  }, [events]);

  const currentDay = getCurrentDayInPST(); // Get the current day in PST

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4">
      {days.map((day, index) => (
        <div
          key={index}
          ref={index === currentDay ? currentDayRef : null} // Assign ref to the current day
          className={`border p-4 min-h-[150px] ${index === currentDay ? 'bg-cyan-100' : ''}`} // Optionally highlight the current day
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
