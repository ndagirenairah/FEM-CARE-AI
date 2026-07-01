import type { AssessmentResult } from "@/db/schema";

export const DISCLAIMER =
  "FemCare AI provides educational information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified clinician.";

// ---------------------------------------------------------------------------
// AI HEALTH ASSESSMENT ENGINE
// ---------------------------------------------------------------------------
export const ASSESSMENT_QUESTIONS = [
  {
    id: "cycleRegularity",
    label: "How regular are your menstrual cycles?",
    options: ["Very regular", "Mostly regular", "Irregular", "Very irregular / absent"],
  },
  {
    id: "pain",
    label: "How would you describe menstrual or pelvic pain?",
    options: ["None", "Mild", "Moderate", "Severe / disabling"],
  },
  {
    id: "hairGrowth",
    label: "Have you noticed unusual facial or body hair growth?",
    options: ["No", "Slight", "Noticeable", "Significant"],
  },
  {
    id: "acne",
    label: "How is your skin / acne?",
    options: ["Clear", "Occasional", "Frequent", "Persistent / cystic"],
  },
  {
    id: "mood",
    label: "How stable has your mood been recently?",
    options: ["Stable", "Minor swings", "Frequent swings", "Very low / anxious"],
  },
  {
    id: "sleep",
    label: "How well are you sleeping?",
    options: ["Very well", "Okay", "Poorly", "Barely sleeping"],
  },
  {
    id: "weight",
    label: "Any recent unexplained weight changes?",
    options: ["No", "Slight", "Noticeable", "Rapid / significant"],
  },
  {
    id: "fatigue",
    label: "How are your energy levels?",
    options: ["High", "Normal", "Often tired", "Constantly exhausted"],
  },
  {
    id: "diet",
    label: "How balanced is your diet?",
    options: ["Very balanced", "Fairly balanced", "Could improve", "Poor"],
  },
  {
    id: "exercise",
    label: "How often do you exercise?",
    options: ["Most days", "A few times a week", "Rarely", "Never"],
  },
] as const;

type Answers = Record<string, string>;

function idx(question: (typeof ASSESSMENT_QUESTIONS)[number], value: string): number {
  const i = question.options.indexOf(value as never);
  return i < 0 ? 0 : i;
}

export function runAssessment(answers: Answers): AssessmentResult {
  let raw = 0;
  let max = 0;
  for (const q of ASSESSMENT_QUESTIONS) {
    const v = answers[q.id];
    if (v === undefined) continue;
    raw += idx(q, v);
    max += q.options.length - 1;
  }
  const severity = max > 0 ? raw / max : 0; // 0 (best) .. 1 (worst)
  const score = Math.round((1 - severity) * 100); // health score, 100 best

  const flags: AssessmentResult["flags"] = [];
  const recommendations: string[] = [];
  let seeDoctor = false;

  const a = (id: string) => answers[id];
  const heavy = (id: string) => {
    const q = ASSESSMENT_QUESTIONS.find((x) => x.id === id)!;
    return idx(q, answers[id] ?? "") >= 2;
  };

  // PCOS-pattern awareness
  if (heavy("cycleRegularity") && (heavy("hairGrowth") || heavy("acne") || heavy("weight"))) {
    flags.push({
      title: "Hormonal / PCOS awareness",
      level: "attention",
      detail:
        "Irregular cycles combined with skin, hair or weight changes can be associated with hormonal imbalances such as PCOS. This is educational awareness, not a diagnosis.",
    });
    recommendations.push(
      "Consider discussing hormonal testing (androgens, insulin, thyroid) with a gynecologist or endocrinologist.",
    );
    seeDoctor = true;
  }

  if (heavy("pain")) {
    flags.push({
      title: "Significant pelvic pain",
      level: a("pain") === "Severe / disabling" ? "urgent" : "attention",
      detail:
        "Persistent or severe menstrual/pelvic pain that disrupts daily life is worth medical evaluation (e.g. endometriosis, fibroids).",
    });
    recommendations.push("Track pain patterns and intensity to share with your clinician.");
    seeDoctor = true;
  }

  if (heavy("mood") || heavy("sleep")) {
    flags.push({
      title: "Mental wellbeing & sleep",
      level: "attention",
      detail:
        "Low mood, anxiety, or poor sleep can affect hormonal and overall health. Support is available and effective.",
    });
    recommendations.push("Try daily wind-down routines, and reach out for mental health support if low mood persists.");
  }

  if (heavy("fatigue") && heavy("weight")) {
    flags.push({
      title: "Thyroid / metabolic awareness",
      level: "attention",
      detail: "Ongoing fatigue with weight changes can sometimes relate to thyroid function or nutritional deficiencies.",
    });
    recommendations.push("Consider a check of thyroid function and iron/ferritin levels.");
    seeDoctor = true;
  }

  if (!heavy("diet")) recommendations.push("Keep prioritizing balanced meals rich in iron, calcium and fiber.");
  else recommendations.push("Aim for balanced meals with lean protein, whole grains, fruits and vegetables.");

  if (heavy("exercise"))
    recommendations.push("Add gentle movement daily — even a 20-minute walk supports hormonal and mental health.");

  if (recommendations.length === 0) {
    recommendations.push("Your responses look reassuring — keep up your healthy routines and regular screenings.");
  }

  const band =
    score >= 80 ? "Thriving" : score >= 60 ? "Doing well" : score >= 40 ? "Needs attention" : "Prioritize your health";

  const summary =
    score >= 80
      ? "Your responses suggest you're generally doing well. Maintain your healthy habits and stay on top of routine screenings."
      : score >= 60
        ? "You're doing reasonably well, with a few areas that could benefit from attention and small lifestyle tweaks."
        : score >= 40
          ? "Several responses suggest areas worth focusing on. Consider the recommendations below and speak with a clinician."
          : "Several responses suggest your wellbeing needs support right now. Please review the flags and consider seeing a healthcare professional.";

  return { score, band, summary, flags, recommendations, seeDoctor };
}

// ---------------------------------------------------------------------------
// SYMPTOM CHECKER
// ---------------------------------------------------------------------------
const RED_FLAGS = [
  "chest pain",
  "difficulty breathing",
  "shortness of breath",
  "severe abdominal pain",
  "heavy bleeding",
  "soaking pad",
  "fainting",
  "passed out",
  "sudden severe headache",
  "vision loss",
  "suicidal",
  "harm myself",
  "seizure",
  "stroke",
  "numb on one side",
  "coughing blood",
  "vomiting blood",
];

type ConditionMatch = {
  name: string;
  slug: string;
  keywords: string[];
  info: string;
  selfCare: string[];
};

const CONDITION_LIBRARY: ConditionMatch[] = [
  {
    name: "Possible PCOS pattern",
    slug: "pcos",
    keywords: ["irregular period", "missed period", "facial hair", "excess hair", "acne", "weight gain", "hair loss"],
    info: "These symptoms can be associated with polycystic ovary syndrome, a common hormonal condition. Diagnosis needs clinical assessment and often blood tests and ultrasound.",
    selfCare: ["Balanced low-glycemic diet", "Regular exercise", "Track your cycles", "Discuss hormone testing with a doctor"],
  },
  {
    name: "Possible endometriosis pattern",
    slug: "endometriosis",
    keywords: ["painful period", "severe cramps", "pelvic pain", "pain during sex", "pain with bowel"],
    info: "Painful, heavy periods and chronic pelvic pain can be linked to endometriosis. It is under-diagnosed and deserves proper evaluation.",
    selfCare: ["Heat therapy", "Anti-inflammatory approach", "Track pain to cycle", "Seek a gynecologist referral"],
  },
  {
    name: "Possible urinary tract infection",
    slug: "uti",
    keywords: ["burning urine", "burning when i pee", "frequent urination", "cloudy urine", "pelvic pressure", "urgency to urinate"],
    info: "Burning during urination with frequency/urgency often suggests a urinary tract infection, which usually needs assessment and possibly antibiotics.",
    selfCare: ["Drink plenty of water", "Avoid irritants", "See a clinician promptly, especially with fever or back pain"],
  },
  {
    name: "Possible thyroid imbalance",
    slug: "thyroid",
    keywords: ["always tired", "fatigue", "cold all the time", "hair thinning", "weight change", "heart racing", "anxiety"],
    info: "Persistent fatigue, temperature sensitivity, and weight or mood changes can relate to thyroid function. A simple blood test can help clarify.",
    selfCare: ["Prioritize sleep", "Balanced diet with iodine sources", "Ask your doctor about a thyroid panel"],
  },
  {
    name: "Premenstrual symptoms (PMS/PMDD)",
    slug: "menopause",
    keywords: ["mood swings", "bloating", "breast tenderness", "irritable before period", "cramps before period"],
    info: "Cyclical mood, bloating and tenderness before your period are common. When severe and disruptive, it may be PMDD, which is treatable.",
    selfCare: ["Regular exercise", "Reduce salt/caffeine", "Track mood across the cycle", "Consider talking to a clinician if severe"],
  },
  {
    name: "Menopause / perimenopause symptoms",
    slug: "menopause",
    keywords: ["hot flashes", "night sweats", "irregular period", "vaginal dryness", "mood changes", "sleep problems"],
    info: "Hot flashes, night sweats and cycle changes commonly signal perimenopause or menopause. Many effective options exist to manage symptoms.",
    selfCare: ["Layered clothing", "Cool sleeping environment", "Weight-bearing exercise for bone health", "Discuss options with your doctor"],
  },
  {
    name: "Possible anemia / iron deficiency",
    slug: "thyroid",
    keywords: ["dizzy", "pale", "shortness of breath with activity", "very tired", "heavy periods"],
    info: "Fatigue, dizziness and paleness, especially with heavy periods, can indicate iron-deficiency anemia. A blood test can confirm.",
    selfCare: ["Iron-rich foods (leafy greens, legumes, red meat)", "Pair iron with vitamin C", "Ask about ferritin testing"],
  },
];

export type SymptomResult = {
  urgent: boolean;
  urgentMessage?: string;
  matches: { name: string; slug: string; info: string; selfCare: string[] }[];
  generalAdvice: string[];
  disclaimer: string;
};

export function checkSymptoms(input: string): SymptomResult {
  const text = input.toLowerCase();
  const redFlag = RED_FLAGS.find((f) => text.includes(f));
  if (redFlag) {
    return {
      urgent: true,
      urgentMessage:
        "Your description includes symptoms that can be serious. Please seek emergency medical care now (call your local emergency number) or go to the nearest emergency department.",
      matches: [],
      generalAdvice: [],
      disclaimer: DISCLAIMER,
    };
  }

  const scored = CONDITION_LIBRARY.map((c) => {
    const hits = c.keywords.filter((k) => text.includes(k)).length;
    return { c, hits };
  })
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits)
    .slice(0, 3)
    .map((x) => ({ name: x.c.name, slug: x.c.slug, info: x.c.info, selfCare: x.c.selfCare }));

  const generalAdvice =
    scored.length === 0
      ? [
          "We couldn't confidently match your description to common patterns.",
          "Keep a symptom diary noting timing, severity and triggers.",
          "If symptoms persist, worsen, or worry you, please consult a healthcare professional.",
        ]
      : [
          "Track how these symptoms change across your cycle.",
          "Stay hydrated, rest, and note any new or worsening signs.",
          "Book a routine appointment to discuss these patterns with a clinician.",
        ];

  return { urgent: false, matches: scored, generalAdvice, disclaimer: DISCLAIMER };
}

// ---------------------------------------------------------------------------
// AI CHATBOT (Health Copilot)
// ---------------------------------------------------------------------------
type ChatRule = { keywords: string[]; answer: string };

const CHAT_RULES: ChatRule[] = [
  {
    keywords: ["late period", "missed period", "period late"],
    answer:
      "A late or missed period can happen for many reasons — stress, weight changes, intense exercise, travel, hormonal shifts, PCOS, thyroid issues, or pregnancy. If you might be pregnant, a home test after a missed period is a good first step. If periods are frequently irregular, consider tracking them here and speaking with a clinician.",
  },
  {
    keywords: ["ovulation", "fertile", "fertility window", "conceive", "trying to get pregnant"],
    answer:
      "Ovulation typically occurs about 14 days before your next period. Your fertile window spans roughly the 5 days before ovulation plus ovulation day. Signs include a slight temperature rise and clearer, stretchy cervical mucus. Use the Cycle Center to see your predicted fertile window.",
  },
  {
    keywords: ["cramp", "period pain", "menstrual pain", "dysmenorrhea"],
    answer:
      "Period cramps are caused by uterine contractions. Heat (a warm pack), gentle movement, hydration, and over-the-counter anti-inflammatories often help. If pain is severe, disabling, or worsening over time, it's worth evaluating for conditions like endometriosis — please see a clinician.",
  },
  {
    keywords: ["pcos", "polycystic"],
    answer:
      "PCOS (polycystic ovary syndrome) is a common hormonal condition that can cause irregular periods, acne, excess hair growth, and weight changes. Management often includes balanced nutrition, regular exercise, and medical care. Visit the Learning Center for a detailed overview.",
  },
  {
    keywords: ["menopause", "hot flash", "perimenopause", "night sweat"],
    answer:
      "Menopause is confirmed after 12 months without a period, usually between ages 45–55. Perimenopause (the transition) can bring hot flashes, sleep changes, mood shifts, and irregular cycles. Bone and heart health become extra important — see the Menopause guidance and discuss options with your doctor.",
  },
  {
    keywords: ["pregnan", "trimester", "expecting"],
    answer:
      "Congratulations if you're expecting! Focus on prenatal vitamins (folic acid), balanced nutrition, hydration, gentle activity, and regular prenatal appointments. Use the Pregnancy Hub to follow weekly development. Contact your provider for bleeding, severe pain, or reduced fetal movement.",
  },
  {
    keywords: ["nutrition", "diet", "eat", "food", "iron"],
    answer:
      "For women's health, prioritize iron (leafy greens, legumes, lean meats), calcium and vitamin D for bones, folate, omega-3s, and plenty of fiber and water. Pair iron-rich foods with vitamin C for absorption. The Nutrition Center has tailored plans for PCOS, pregnancy, menopause and more.",
  },
  {
    keywords: ["exercise", "workout", "fitness", "pelvic floor", "kegel"],
    answer:
      "Aim for a mix of cardio, strength, and flexibility. Pelvic floor (Kegel) exercises support bladder and core health. During pregnancy and menopause, choose appropriately safe routines — the Fitness Center has guided plans for each life stage.",
  },
  {
    keywords: ["stress", "anxious", "anxiety", "mood", "depress"],
    answer:
      "Hormonal cycles can influence mood. Regular sleep, movement, breathing exercises, journaling, and social connection all help. If low mood, anxiety, or hopelessness persist for more than two weeks or affect daily life, please reach out to a mental health professional — support works.",
  },
  {
    keywords: ["birth control", "contraception", "pill"],
    answer:
      "There are many contraception options (pills, IUDs, implants, injections, barrier methods), each with different benefits. The best choice depends on your health, goals, and preferences — a clinician can help you decide. You can set birth control reminders in the Medication Center.",
  },
  {
    keywords: ["discharge", "itch", "yeast", "infection"],
    answer:
      "Some clear/white discharge is normal and changes across the cycle. Itching, strong odor, unusual color, or discomfort can indicate an infection (like a yeast infection or bacterial vaginosis) that may need treatment. Please see a clinician for persistent or bothersome symptoms.",
  },
];

export function chatReply(message: string): string {
  const text = message.toLowerCase();

  if (RED_FLAGS.some((f) => text.includes(f))) {
    return "It sounds like you may be describing something serious. Please seek emergency medical care immediately by calling your local emergency number or going to the nearest emergency department. " + DISCLAIMER;
  }

  const matched = CHAT_RULES.filter((r) => r.keywords.some((k) => text.includes(k)));
  if (matched.length > 0) {
    return matched[0].answer + "\n\n" + DISCLAIMER;
  }

  if (text.includes("hello") || text.includes("hi") || text.includes("hey")) {
    return "Hi! I'm your FemCare AI Copilot. I can help with questions about periods, cycles, fertility, pregnancy, menopause, nutrition, fitness, and mental wellbeing. What would you like to know?";
  }

  return (
    "I'm here to help with women's health topics like menstrual health, fertility, pregnancy, menopause, nutrition, fitness and mental wellbeing. Could you rephrase or add a bit more detail? For personalized medical concerns, please consult a clinician.\n\n" +
    DISCLAIMER
  );
}
