import Timetable from "../components/Timetable";
import { getWeekRange } from '../lib/time';

export default function App() {
  const { dateMon, dateSun } = getWeekRange();

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="w-full max-w-5xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Fitness Schedule ({dateMon} - {dateSun})</h1>
        <Timetable />
      </div>
    </div>
  );
}
