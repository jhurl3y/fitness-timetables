import Timetable from "../components/Timetable";
import { getWeekRange } from '../lib/time';

export default function App() {
  const { dateMon, dateSun } = getWeekRange();

  return (
    <div className="min-h-screen bg-background flex justify-center items-center">
      <div className="w-full max-w-5xl bg-card-background shadow-md rounded-lg p-6 border border-card-border">
        <h1 className="text-3xl font-bold mb-6 text-foreground text-center">
          Fitness Schedule
          <span className="block text-lg font-medium text-foreground/80 mt-2">
            {dateMon} - {dateSun}
          </span>
        </h1>
        <Timetable />
      </div>
    </div>
  );
}
