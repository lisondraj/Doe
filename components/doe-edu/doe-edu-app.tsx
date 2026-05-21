import { DoeEduSidebar } from "./doe-edu-sidebar";
import { DoeEduWorkspace } from "./doe-edu-workspace";

export function DoeEduApp() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[#F4F4F5] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] rounded-none border-0">
        <div className="min-h-0 flex-1 overflow-hidden bg-white rounded-none">
          <div className="flex h-full min-h-[520px] w-full">
            <div className="flex h-full w-full min-w-0">
              <DoeEduSidebar />
              <DoeEduWorkspace />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
