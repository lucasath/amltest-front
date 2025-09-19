import { Open_Sans } from "next/font/google";
import TasksTemplate from "@/templates/Tasks";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"]
})

export default function Home() {
  return (
    <div
      className={`${openSans}`}
    >
      <main className="flex flex-col gap-[24px] row-start-2 items-center">
        <TasksTemplate />
      </main>
    </div>
  );
}
