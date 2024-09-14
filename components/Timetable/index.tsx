"use client"
import React, { useEffect, useState } from 'react';
import { Event } from '../../lib/types'
import { days } from '../../lib/constants'


const Timetable: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const res = await fetch('/api/timetable');
      const {data} = await res.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  return (
    <div className="grid grid-cols-7 gap-2 p-4">
      {days.map((day, index) => (
        <div key={index} className="border p-2">
          <h3 className="font-semibold text-lg mb-2">{day}</h3>
          <div className="space-y-2">
            {events
              .filter((event) => event.day === index)
              .map((event, i) => (
                <div key={i} className="bg-blue-100 text-blue-800 p-2 rounded">
                  <p className="font-medium">{event.title}</p>
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
