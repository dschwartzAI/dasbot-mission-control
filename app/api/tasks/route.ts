import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { MissionControlData } from "@/types/task";

export async function GET() {
  try {
    const filePath = path.join("/home/claudebot/clawd", "mission-control.json");
    const fileContent = await readFile(filePath, "utf-8");
    const data: MissionControlData = JSON.parse(fileContent);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error reading mission-control.json:", error);
    
    // Return empty data if file doesn't exist
    return NextResponse.json({
      tasks: [],
      lastUpdated: new Date().toISOString(),
    });
  }
}
