import { DoePhoneHomeCallLogicDiagram } from "@/components/doephone/DoePhoneHomeCallLogicDiagram";

/** Legacy home call-logic canvas — scaled into Meet Doe row-2 middle tile. */
export function StoryMeetDoeCallLogicDiagram() {
  return (
    <div className="story-meet-doe-call-logic" aria-hidden="true">
      <div className="story-meet-doe-call-logic__scale">
        <DoePhoneHomeCallLogicDiagram />
      </div>
    </div>
  );
}
