"use client";

import type { ReactNode } from "react";

import type { VoiceAgentLesson } from "@/lib/voice-agent/voice-agent-types";

function LessonList({ items }: { items: readonly string[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="voice-agent-page__lesson-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function LessonCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  if (!children) return null;
  return (
    <section className="voice-agent-page__lesson-card">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

export function VoiceAgentLessonPage({
  lesson,
  loading,
  topic,
  error,
  onRetry,
}: {
  lesson: VoiceAgentLesson | null;
  loading?: boolean;
  topic?: string | null;
  error?: string | null;
  onRetry?: () => void;
}) {
  if (loading && !lesson) {
    return (
      <div className="voice-agent-page__lesson" aria-busy="true">
        <p className="voice-agent-page__hint">Writing a dense teaching page on {topic || "this topic"}…</p>
        <div className="voice-agent-page__lesson-skel" />
        <div className="voice-agent-page__lesson-skel" />
        <div className="voice-agent-page__lesson-skel" />
      </div>
    );
  }

  if (error && !lesson) {
    return (
      <div className="voice-agent-page__lesson">
        <p className="voice-agent-page__error">{error}</p>
        {onRetry ? (
          <button type="button" className="voice-agent-page__cta voice-agent-page__cta--secondary" onClick={onRetry}>
            Try generating again
          </button>
        ) : null}
      </div>
    );
  }

  if (!lesson) {
    return (
      <p className="voice-agent-page__hint">
        {topic ? `No teaching page saved yet for ${topic}.` : "The teaching page will appear here once the topic is set."}
      </p>
    );
  }

  return (
    <article className="voice-agent-page__lesson">
      {lesson.hook ? <p className="voice-agent-page__lesson-hook">{lesson.hook}</p> : null}

      <LessonCard title="History — ask these">
        {lesson.history.length > 0 ? (
          <div className="voice-agent-page__lesson-groups">
            {lesson.history.map((group) => (
              <div key={group.heading} className="voice-agent-page__lesson-group">
                <h4>{group.heading}</h4>
                <LessonList items={group.bullets} />
              </div>
            ))}
          </div>
        ) : null}
      </LessonCard>

      <LessonCard title="Differential diagnosis">
        {lesson.ddxCantMiss.length > 0 ? (
          <>
            <h4 className="voice-agent-page__lesson-kicker">Can&apos;t miss</h4>
            <LessonList items={lesson.ddxCantMiss} />
          </>
        ) : null}
        {lesson.ddxRanked.length > 0 ? (
          <>
            <h4 className="voice-agent-page__lesson-kicker">Ranked</h4>
            <ul className="voice-agent-page__lesson-list">
              {lesson.ddxRanked.map((item) => (
                <li key={item.name}>
                  <strong>{item.name}.</strong> {item.why}
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </LessonCard>

      <LessonCard title="Examination">
        <LessonList items={lesson.exam} />
      </LessonCard>

      <div className="voice-agent-page__lesson-split">
        <LessonCard title="Investigations">
          {lesson.investigationsFirstLine.length > 0 ? (
            <>
              <h4 className="voice-agent-page__lesson-kicker">First line</h4>
              <LessonList items={lesson.investigationsFirstLine} />
            </>
          ) : null}
          {lesson.investigationsNextLine.length > 0 ? (
            <>
              <h4 className="voice-agent-page__lesson-kicker">Next line</h4>
              <LessonList items={lesson.investigationsNextLine} />
            </>
          ) : null}
        </LessonCard>

        <LessonCard title="Management / counselling">
          {lesson.managementImmediate.length > 0 ? (
            <>
              <h4 className="voice-agent-page__lesson-kicker">Immediate</h4>
              <LessonList items={lesson.managementImmediate} />
            </>
          ) : null}
          {lesson.managementTreatment.length > 0 ? (
            <>
              <h4 className="voice-agent-page__lesson-kicker">Treatment</h4>
              <LessonList items={lesson.managementTreatment} />
            </>
          ) : null}
          {lesson.counseling.length > 0 ? (
            <>
              <h4 className="voice-agent-page__lesson-kicker">Counsel the patient</h4>
              <LessonList items={lesson.counseling} />
            </>
          ) : null}
          {lesson.safetyNet.length > 0 ? (
            <>
              <h4 className="voice-agent-page__lesson-kicker">Safety-net</h4>
              <LessonList items={lesson.safetyNet} />
            </>
          ) : null}
        </LessonCard>
      </div>

      {lesson.examinerQuestions.length > 0 ? (
        <LessonCard title="Top examiner questions">
          <ol className="voice-agent-page__lesson-qs">
            {lesson.examinerQuestions.map((item, index) => (
              <li key={`${index}-${item.question}`}>
                <p className="voice-agent-page__lesson-q">{item.question}</p>
                {item.answer ? <p className="voice-agent-page__lesson-a">{item.answer}</p> : null}
              </li>
            ))}
          </ol>
        </LessonCard>
      ) : null}
    </article>
  );
}
