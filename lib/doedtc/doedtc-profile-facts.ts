import { addDoeDtcMem0Fact } from "@/lib/doedtc/doedtc-memory";
import { insertDoeDtcMemory } from "@/lib/doedtc/doedtc-db";
import { doeDtcFindPhoneCountry } from "@/lib/doedtc/doedtc-phone-countries";
import { doeDtcGenderLabel, type DoeDtcFamilyRelationship, type DoeDtcGender } from "@/lib/doedtc/doedtc-types";

export type DoeDtcOnboardingMemoryInput = {
  fullName: string;
  email: string;
  dateOfBirth: string;
  gender: DoeDtcGender;
  country: string;
  medications: string[];
  conditions: string[];
  familyMembers: Array<{
    fullName: string;
    relationship: DoeDtcFamilyRelationship;
    gender?: DoeDtcGender | null;
    dateOfBirth?: string | null;
  }>;
  medicalDeferred: boolean;
};

export function buildDoeDtcOnboardingFacts(params: DoeDtcOnboardingMemoryInput): string[] {
  const facts = [
    `Name is ${params.fullName}.`,
    `Email is ${params.email}.`,
    `Date of birth is ${params.dateOfBirth}.`,
    `Gender is ${doeDtcGenderLabel(params.gender)}.`,
    `Country is ${doeDtcFindPhoneCountry(params.country).name}.`,
  ];

  if (params.medicalDeferred) {
    facts.push("They chose to add medications and conditions later.");
  } else {
    if (params.medications.length > 0) {
      facts.push(`Medications: ${params.medications.join(", ")}.`);
    }
    if (params.conditions.length > 0) {
      facts.push(`Conditions: ${params.conditions.join(", ")}.`);
    }
  }

  for (const member of params.familyMembers) {
    const details = [
      member.relationship,
      member.gender ? doeDtcGenderLabel(member.gender) : null,
      member.dateOfBirth ? `born ${member.dateOfBirth}` : null,
    ].filter(Boolean);
    facts.push(`Family member ${member.fullName} (${details.join(", ")}).`);
  }

  return facts;
}

export async function rememberDoeDtcOnboarding(params: {
  userId: string;
} & DoeDtcOnboardingMemoryInput): Promise<void> {
  const facts = buildDoeDtcOnboardingFacts(params);
  await Promise.all(
    facts.map(async (fact) => {
      await insertDoeDtcMemory({ userId: params.userId, fact, category: "onboarding" });
      await addDoeDtcMem0Fact({ userId: params.userId, fact });
    }),
  );
}
