"use client";

import { useState } from "react";

import {
  PRODUCTNEW_PATIENT_CHARTS,
  PRODUCTNEW_SCHEDULE,
  PRODUCTNEW_SCHEDULE_DAY,
  type ProductNewPatientChart,
  type ProductNewScheduleAppt,
} from "@/lib/productnew/productnew-copy";

function parseTime(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

const STATUS_LABEL: Record<ProductNewScheduleAppt["status"], string> = {
  done: "Done",
  active: "In room",
  upcoming: "Upcoming",
  open: "Open",
};

function PatientListItem({
  appt,
  active,
  onSelect,
}: {
  appt: ProductNewScheduleAppt;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        className={`productnew-patients__item${active ? " productnew-patients__item--active" : ""}`}
        onClick={onSelect}
      >
        <span className="productnew-patients__item-time">{appt.time}</span>
        <span className="productnew-patients__item-copy">
          <span className="productnew-patients__item-name">{appt.patient}</span>
          <span className="productnew-patients__item-meta">
            {appt.type} · Room {appt.room}
          </span>
        </span>
        <span className={`productnew-patients__item-status productnew-patients__item-status--${appt.status}`}>
          {STATUS_LABEL[appt.status]}
        </span>
      </button>
    </li>
  );
}

function VitalsGrid({ vitals }: { vitals: ProductNewPatientChart["vitals"] }) {
  if (!vitals) {
    return <p className="productnew-chart__empty">No vitals on file yet — will be captured at intake.</p>;
  }

  return (
    <div className="productnew-vitals-grid">
      <div className="productnew-vitals-tile">
        <span className="productnew-vitals-tile__label">Blood pressure</span>
        <span className="productnew-vitals-tile__value">{vitals.bp}</span>
      </div>
      <div className="productnew-vitals-tile">
        <span className="productnew-vitals-tile__label">Heart rate</span>
        <span className="productnew-vitals-tile__value">{vitals.hr}</span>
      </div>
      <div className="productnew-vitals-tile">
        <span className="productnew-vitals-tile__label">Temperature</span>
        <span className="productnew-vitals-tile__value">{vitals.temp}</span>
      </div>
      <div className="productnew-vitals-tile">
        <span className="productnew-vitals-tile__label">Weight</span>
        <span className="productnew-vitals-tile__value">{vitals.weight}</span>
      </div>
    </div>
  );
}

function PatientChart({ appt, chart }: { appt: ProductNewScheduleAppt; chart: ProductNewPatientChart | undefined }) {
  if (!chart) {
    return (
      <div className="productnew-chart">
        <p className="productnew-chart__empty">No chart on file for {appt.patient}.</p>
      </div>
    );
  }

  return (
    <div className="productnew-chart">
      <div className="productnew-chart__head">
        <div>
          <p className="productnew-chart__name">{chart.name}</p>
          <p className="productnew-chart__meta">
            {chart.age} · {chart.sex} · {chart.mrn}
          </p>
        </div>
        <div className="productnew-chart__visit">
          <p className="productnew-chart__visit-time">
            {appt.time}–{appt.end} · Room {appt.room}
          </p>
          <p className="productnew-chart__visit-meta">
            {appt.type || "Open slot"} · {appt.provider}
          </p>
        </div>
      </div>

      <p className="productnew-chart__section-title">Vitals</p>
      <VitalsGrid vitals={chart.vitals} />

      <div className="productnew-chart__grid">
        <div>
          <p className="productnew-chart__section-title">Allergies</p>
          {chart.allergies.length > 0 ? (
            <ul className="productnew-chart__pill-list">
              {chart.allergies.map((allergy) => (
                <li key={allergy} className="productnew-chart__pill productnew-chart__pill--alert">
                  {allergy}
                </li>
              ))}
            </ul>
          ) : (
            <p className="productnew-chart__empty">NKDA — no known drug allergies</p>
          )}
        </div>

        <div>
          <p className="productnew-chart__section-title">Active problems</p>
          {chart.problems.length > 0 ? (
            <ul className="productnew-chart__pill-list">
              {chart.problems.map((problem) => (
                <li key={problem} className="productnew-chart__pill">
                  {problem}
                </li>
              ))}
            </ul>
          ) : (
            <p className="productnew-chart__empty">No active problems on file</p>
          )}
        </div>
      </div>

      <p className="productnew-chart__section-title">Medications</p>
      {chart.medications.length > 0 ? (
        <ul className="productnew-chart__list">
          {chart.medications.map((med) => (
            <li key={med} className="productnew-chart__list-item">
              {med}
            </li>
          ))}
        </ul>
      ) : (
        <p className="productnew-chart__empty">No active medications</p>
      )}

      <p className="productnew-chart__section-title">Last visit</p>
      <p className="productnew-chart__last-visit">{chart.lastVisit}</p>
    </div>
  );
}

/** Patients tab: today's appointment roster with a full patient chart per selected visit. */
export function ProductNewPatientsView() {
  const patientsToday = [...PRODUCTNEW_SCHEDULE]
    .filter((appt) => appt.status !== "open")
    .sort((a, b) => parseTime(a.time) - parseTime(b.time));

  const [selectedId, setSelectedId] = useState(
    patientsToday.find((a) => a.status === "active")?.id ?? patientsToday[0]?.id ?? "",
  );
  const selected = patientsToday.find((a) => a.id === selectedId) ?? patientsToday[0];
  const selectedChart = selected ? PRODUCTNEW_PATIENT_CHARTS.find((c) => c.name === selected.patient) : undefined;

  return (
    <>
      <div className="productnew-patients-head">
        <h2 className="productnew-patients-head__title">Patients</h2>
        <p className="productnew-patients-head__meta">
          {patientsToday.length} on the schedule · {PRODUCTNEW_SCHEDULE_DAY}
        </p>
      </div>

      <div className="productnew-patients">
        <ul className="productnew-patients__list">
          {patientsToday.map((appt) => (
            <PatientListItem
              key={appt.id}
              appt={appt}
              active={appt.id === selected?.id}
              onSelect={() => setSelectedId(appt.id)}
            />
          ))}
        </ul>

        {selected ? <PatientChart appt={selected} chart={selectedChart} /> : null}
      </div>
    </>
  );
}
