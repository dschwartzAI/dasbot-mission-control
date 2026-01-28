import { KanbanBoard } from "@/components/KanbanBoard";
import { MissionControlData } from "@/types/task";
import { readFile } from "fs/promises";
import path from "path";

async function getTasks(): Promise<MissionControlData> {
  try {
    const filePath = path.join("/home/claudebot/clawd", "mission-control.json");
    const fileContent = await readFile(filePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading mission-control.json:", error);
    return {
      tasks: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

export default async function Home() {
  const data = await getTasks();

  return <KanbanBoard initialTasks={data.tasks} />;
}
