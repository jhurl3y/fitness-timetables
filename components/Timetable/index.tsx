"use client";
import React, { useEffect, useState } from 'react';
import { Event } from '../../lib/types';
import { days } from '../../lib/constants';
import { convertTimeTo24Hour } from '../../lib/time';

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

type EventWithColor = Event & {
  color: keyof typeof COLORS; // Narrow the color type to match the COLORS keys
};

const Timetable: React.FC = () => {
  const [events, setEvents] = useState<EventWithColor[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/timetable');
      const { data } = await res.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 p-4">
      {days.map((day, index) => (
        <div key={index} className="border p-4 min-h-[150px]">
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
