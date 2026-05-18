import { DoeSchedulesAppMock } from "@/components/doe-schedules-app-mock";

export default function DoeBuildNewPage() {
  return (
    <main className="h-dvh min-h-0 w-full overflow-hidden bg-white">
      <DoeSchedulesAppMock variant="fullscreen" />
    </main>
  );
}
