import { KanbanBoard } from "@/components/KanbanBoard";

export const dynamic = 'force-dynamic';

export default async function Home() {
  return <KanbanBoard initialTasks={[]} />;
}
