import Timetable from "../components/Timetable";
import { getWeekRange } from '../lib/time';

export default function App() {
  const { dateMon, dateSun } = getWeekRange();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Fitness Schedule
          <span className="block text-lg font-medium text-gray-600 mt-2">
            {dateMon} - {dateSun}
          </span>
        </h1>
        <Timetable />
      </div>
    </div>
  );
}
