// Static educational + program content for the platform.

export type Disease = {
  slug: string;
  name: string;
  emoji: string;
  summary: string;
  causes: string[];
  symptoms: string[];
  prevention: string[];
  treatment: string[];
  seeDoctor: string[];
};

export const DISEASES: Disease[] = [
  {
    slug: "pcos",
    name: "Polycystic Ovary Syndrome (PCOS)",
    emoji: "🧬",
    summary:
      "A common hormonal disorder affecting how the ovaries work, often causing irregular periods and elevated androgens.",
    causes: ["Hormonal imbalance (excess androgens)", "Insulin resistance", "Genetic predisposition", "Low-grade inflammation"],
    symptoms: ["Irregular or missing periods", "Excess facial/body hair", "Acne & oily skin", "Weight gain", "Thinning scalp hair", "Difficulty conceiving"],
    prevention: ["Maintain a healthy weight", "Balanced low-glycemic diet", "Regular physical activity", "Manage stress and sleep"],
    treatment: ["Lifestyle modification", "Hormonal birth control to regulate cycles", "Insulin-sensitizing medication", "Fertility support when trying to conceive"],
    seeDoctor: ["Periods absent for 3+ months", "Struggling to conceive", "Rapid hair growth or hair loss", "Signs of high blood sugar"],
  },
  {
    slug: "endometriosis",
    name: "Endometriosis",
    emoji: "🌸",
    summary: "Tissue similar to the uterine lining grows outside the uterus, causing pain and sometimes infertility.",
    causes: ["Retrograde menstruation", "Immune factors", "Genetic factors", "Hormonal influences"],
    symptoms: ["Severe menstrual cramps", "Chronic pelvic pain", "Pain during sex", "Pain with bowel movements", "Heavy periods", "Infertility"],
    prevention: ["No proven prevention, but early recognition helps", "Regular exercise", "Managing estrogen exposure with a clinician"],
    treatment: ["Pain management", "Hormonal therapy", "Laparoscopic surgery", "Fertility treatment when needed"],
    seeDoctor: ["Debilitating period pain", "Pain during intercourse", "Difficulty getting pregnant"],
  },
  {
    slug: "uti",
    name: "Urinary Tract Infection (UTI)",
    emoji: "💧",
    summary: "A common infection of the urinary system, most often the bladder, usually caused by bacteria.",
    causes: ["Bacteria entering the urethra", "Sexual activity", "Incomplete bladder emptying", "Certain birth control methods"],
    symptoms: ["Burning during urination", "Frequent urge to urinate", "Cloudy or strong-smelling urine", "Pelvic pressure", "Blood in urine"],
    prevention: ["Stay hydrated", "Urinate after intercourse", "Wipe front to back", "Avoid irritating products"],
    treatment: ["Antibiotics as prescribed", "Increased fluids", "Pain relief"],
    seeDoctor: ["Fever, chills or back pain (possible kidney involvement)", "Blood in urine", "Symptoms not improving", "Recurrent infections"],
  },
  {
    slug: "breast-cancer",
    name: "Breast Cancer",
    emoji: "🎀",
    summary: "Cancer forming in breast tissue; early detection dramatically improves outcomes.",
    causes: ["Age & genetics (BRCA1/2)", "Hormonal factors", "Family history", "Lifestyle factors"],
    symptoms: ["New lump in breast/underarm", "Change in breast size/shape", "Skin dimpling", "Nipple discharge or changes", "Persistent breast pain"],
    prevention: ["Regular self-exams & screening mammograms", "Maintain healthy weight", "Limit alcohol", "Stay active"],
    treatment: ["Surgery", "Radiation", "Chemotherapy", "Hormone or targeted therapy"],
    seeDoctor: ["Any new lump or breast change", "Nipple discharge", "Skin changes on the breast"],
  },
  {
    slug: "cervical-cancer",
    name: "Cervical Cancer",
    emoji: "🩺",
    summary: "Cancer of the cervix, largely preventable through HPV vaccination and regular screening.",
    causes: ["Persistent HPV infection", "Smoking", "Weakened immune system"],
    symptoms: ["Abnormal vaginal bleeding", "Bleeding after sex", "Unusual discharge", "Pelvic pain"],
    prevention: ["HPV vaccination", "Regular Pap/HPV screening", "Safe sex practices", "Avoid smoking"],
    treatment: ["Surgery", "Radiation", "Chemotherapy depending on stage"],
    seeDoctor: ["Bleeding between periods or after sex", "Unusual discharge", "Missed screening"],
  },
  {
    slug: "ovarian-cancer",
    name: "Ovarian Cancer",
    emoji: "🔬",
    summary: "Cancer beginning in the ovaries; symptoms can be subtle, so awareness matters.",
    causes: ["Genetics (BRCA)", "Age", "Family history", "Hormonal & reproductive factors"],
    symptoms: ["Persistent bloating", "Feeling full quickly", "Pelvic/abdominal pain", "Urinary urgency", "Changes in bowel habits"],
    prevention: ["Know your family history", "Genetic counseling if high risk", "Discuss risk-reducing options with a doctor"],
    treatment: ["Surgery", "Chemotherapy", "Targeted therapy"],
    seeDoctor: ["Bloating/fullness lasting weeks", "New persistent pelvic pain", "Strong family history"],
  },
  {
    slug: "fibroids",
    name: "Uterine Fibroids",
    emoji: "⚪",
    summary: "Non-cancerous growths of the uterus that can cause heavy bleeding and pressure symptoms.",
    causes: ["Hormonal factors (estrogen/progesterone)", "Genetics", "Age (more common 30s–40s)"],
    symptoms: ["Heavy or prolonged periods", "Pelvic pressure/pain", "Frequent urination", "Back pain", "Bloating"],
    prevention: ["Maintain healthy weight", "Balanced diet", "Regular check-ups"],
    treatment: ["Watchful waiting", "Medication", "Minimally invasive procedures", "Surgery when needed"],
    seeDoctor: ["Very heavy periods causing fatigue", "Severe pelvic pressure", "Difficulty conceiving"],
  },
  {
    slug: "thyroid",
    name: "Thyroid Disorders",
    emoji: "🦋",
    summary: "An underactive or overactive thyroid affects metabolism, energy, mood and menstrual cycles.",
    causes: ["Autoimmune conditions (Hashimoto's, Graves')", "Iodine imbalance", "Genetics", "Postpartum changes"],
    symptoms: ["Fatigue or restlessness", "Weight changes", "Temperature sensitivity", "Hair changes", "Irregular periods", "Mood changes"],
    prevention: ["Adequate iodine intake", "Regular screening if at risk", "Manage autoimmune risk factors"],
    treatment: ["Thyroid hormone replacement", "Anti-thyroid medication", "Regular monitoring"],
    seeDoctor: ["Persistent fatigue with weight change", "Neck swelling", "Heart palpitations", "Cycle changes"],
  },
  {
    slug: "menopause",
    name: "Menopause",
    emoji: "🌸",
    summary: "The natural end of menstrual cycles, typically between 45–55, with hormonal transition symptoms.",
    causes: ["Natural decline in ovarian function", "Surgical removal of ovaries", "Certain medical treatments"],
    symptoms: ["Hot flashes & night sweats", "Irregular then absent periods", "Vaginal dryness", "Mood & sleep changes", "Bone density loss"],
    prevention: ["Cannot be prevented, but symptoms are manageable", "Weight-bearing exercise", "Calcium & vitamin D", "Healthy lifestyle"],
    treatment: ["Hormone therapy (where appropriate)", "Non-hormonal medications", "Lifestyle strategies", "Bone health support"],
    seeDoctor: ["Bleeding after menopause", "Severe symptoms affecting life", "Bone health concerns"],
  },
  {
    slug: "pregnancy-conditions",
    name: "Pregnancy Conditions",
    emoji: "🤰",
    summary: "Conditions that can arise in pregnancy such as gestational diabetes and preeclampsia require monitoring.",
    causes: ["Physiological changes of pregnancy", "Pre-existing conditions", "Placental factors"],
    symptoms: ["High blood pressure", "Swelling of hands/face", "Severe headaches", "Vision changes", "Excessive thirst/urination"],
    prevention: ["Regular prenatal care", "Balanced nutrition", "Healthy weight gain", "Monitoring blood pressure & glucose"],
    treatment: ["Close monitoring", "Dietary management", "Medication when needed", "Timely delivery planning"],
    seeDoctor: ["Severe headache or vision changes", "Heavy bleeding", "Reduced fetal movement", "Severe swelling"],
  },
];

export type NutritionPlan = {
  slug: string;
  title: string;
  emoji: string;
  focus: string;
  keyFoods: string[];
  sampleDay: { meal: string; item: string }[];
  grocery: string[];
};

export const NUTRITION_PLANS: NutritionPlan[] = [
  {
    slug: "iron",
    title: "Iron Deficiency Support",
    emoji: "🥬",
    focus: "Rebuild iron stores, especially helpful with heavy periods.",
    keyFoods: ["Leafy greens", "Legumes & lentils", "Lean red meat", "Fortified cereals", "Vitamin C (for absorption)"],
    sampleDay: [
      { meal: "Breakfast", item: "Fortified oats with berries & orange juice" },
      { meal: "Lunch", item: "Spinach & lentil salad with bell peppers" },
      { meal: "Dinner", item: "Lean beef stir-fry with broccoli & brown rice" },
      { meal: "Snack", item: "Hummus with sliced tomatoes" },
    ],
    grocery: ["Spinach", "Lentils", "Lean beef", "Oranges", "Fortified cereal", "Bell peppers"],
  },
  {
    slug: "pregnancy",
    title: "Pregnancy Nutrition",
    emoji: "🤰",
    focus: "Support baby's development with folate, iron, calcium and protein.",
    keyFoods: ["Folate-rich greens", "Dairy/calcium", "Lean protein", "Whole grains", "Omega-3 (safe fish)"],
    sampleDay: [
      { meal: "Breakfast", item: "Greek yogurt with fortified granola & fruit" },
      { meal: "Lunch", item: "Quinoa bowl with chickpeas & avocado" },
      { meal: "Dinner", item: "Baked salmon with sweet potato & greens" },
      { meal: "Snack", item: "Cheese with whole-grain crackers" },
    ],
    grocery: ["Greek yogurt", "Quinoa", "Salmon", "Sweet potato", "Leafy greens", "Chickpeas"],
  },
  {
    slug: "breastfeeding",
    title: "Breastfeeding Nutrition",
    emoji: "🍼",
    focus: "Extra calories, fluids and nutrients to support milk supply.",
    keyFoods: ["Plenty of water", "Oats", "Lean protein", "Healthy fats", "Calcium-rich foods"],
    sampleDay: [
      { meal: "Breakfast", item: "Oatmeal with nuts, seeds & banana" },
      { meal: "Lunch", item: "Chicken & vegetable wholegrain wrap" },
      { meal: "Dinner", item: "Lentil curry with brown rice" },
      { meal: "Snack", item: "Trail mix & a glass of milk" },
    ],
    grocery: ["Oats", "Chicken", "Lentils", "Nuts & seeds", "Milk", "Bananas"],
  },
  {
    slug: "pcos",
    title: "PCOS-Friendly Plan",
    emoji: "🧬",
    focus: "Low-glycemic, anti-inflammatory eating to support insulin sensitivity.",
    keyFoods: ["Non-starchy vegetables", "Lean protein", "Whole grains", "Healthy fats", "Low-GI fruits"],
    sampleDay: [
      { meal: "Breakfast", item: "Veggie omelet with avocado" },
      { meal: "Lunch", item: "Grilled chicken salad with olive oil dressing" },
      { meal: "Dinner", item: "Baked fish with quinoa & roasted vegetables" },
      { meal: "Snack", item: "Greek yogurt with berries & chia" },
    ],
    grocery: ["Eggs", "Avocado", "Chicken", "Quinoa", "Berries", "Leafy greens"],
  },
  {
    slug: "menopause",
    title: "Menopause Nutrition",
    emoji: "🌸",
    focus: "Protect bones and heart while managing weight and symptoms.",
    keyFoods: ["Calcium & vitamin D foods", "Phytoestrogens (soy, flax)", "Lean protein", "Whole grains", "Colorful vegetables"],
    sampleDay: [
      { meal: "Breakfast", item: "Fortified soy yogurt with flaxseed & fruit" },
      { meal: "Lunch", item: "Tofu & vegetable grain bowl" },
      { meal: "Dinner", item: "Grilled salmon with kale & sweet potato" },
      { meal: "Snack", item: "Almonds & an orange" },
    ],
    grocery: ["Soy yogurt", "Flaxseed", "Tofu", "Salmon", "Kale", "Almonds"],
  },
  {
    slug: "weight",
    title: "Weight Management",
    emoji: "⚖️",
    focus: "Balanced, satisfying meals with steady energy and portion awareness.",
    keyFoods: ["High-fiber vegetables", "Lean protein", "Whole grains", "Healthy fats", "Water"],
    sampleDay: [
      { meal: "Breakfast", item: "Veggie scramble with whole-grain toast" },
      { meal: "Lunch", item: "Big salad with grilled chicken & beans" },
      { meal: "Dinner", item: "Stir-fried tofu & vegetables with brown rice" },
      { meal: "Snack", item: "Apple with a small handful of nuts" },
    ],
    grocery: ["Mixed vegetables", "Chicken/tofu", "Brown rice", "Beans", "Apples", "Nuts"],
  },
];

export type Workout = {
  slug: string;
  title: string;
  emoji: string;
  duration: string;
  level: string;
  description: string;
  moves: string[];
};

export const WORKOUTS: Workout[] = [
  {
    slug: "home",
    title: "Full-Body Home Workout",
    emoji: "🏠",
    duration: "20 min",
    level: "All levels",
    description: "A no-equipment routine to build strength and energy.",
    moves: ["Squats x15", "Push-ups (knee optional) x10", "Glute bridges x15", "Plank 30s", "Repeat 3 rounds"],
  },
  {
    slug: "yoga",
    title: "Gentle Yoga Flow",
    emoji: "🧘‍♀️",
    duration: "15 min",
    level: "Beginner",
    description: "Relaxing flow to ease tension and support hormonal balance.",
    moves: ["Cat-cow x8", "Child's pose 1 min", "Downward dog 30s", "Cobra x5", "Seated forward fold 1 min"],
  },
  {
    slug: "stretching",
    title: "Daily Stretch Routine",
    emoji: "🤸‍♀️",
    duration: "10 min",
    level: "All levels",
    description: "Mobility and flexibility to relieve stiffness.",
    moves: ["Neck rolls", "Shoulder stretch", "Hamstring stretch", "Hip flexor stretch", "Spinal twist"],
  },
  {
    slug: "walking",
    title: "Walking Plan",
    emoji: "🚶‍♀️",
    duration: "30 min",
    level: "All levels",
    description: "Progressive walking for heart and mental health.",
    moves: ["5 min easy warm-up", "20 min brisk pace", "5 min cool-down", "Aim for 5 days/week"],
  },
  {
    slug: "pregnancy",
    title: "Pregnancy-Safe Movement",
    emoji: "🤰",
    duration: "20 min",
    level: "Prenatal",
    description: "Low-impact exercises safe for most pregnancies (confirm with your provider).",
    moves: ["Gentle walking", "Prenatal squats", "Pelvic tilts", "Seated stretches", "Breathing practice"],
  },
  {
    slug: "pelvic-floor",
    title: "Pelvic Floor Strengthening",
    emoji: "💪",
    duration: "10 min",
    level: "All levels",
    description: "Kegel-based routine to support bladder and core health.",
    moves: ["Slow Kegels: squeeze 5s x10", "Quick Kegels x10", "Bridge hold x8", "Deep core breathing", "Repeat daily"],
  },
  {
    slug: "menopause",
    title: "Menopause-Friendly Strength",
    emoji: "🌸",
    duration: "25 min",
    level: "Intermediate",
    description: "Weight-bearing and strength work to protect bones.",
    moves: ["Bodyweight squats x12", "Wall push-ups x12", "Step-ups x10 each", "Standing march", "Balance holds"],
  },
];

export type LearnArticle = {
  slug: string;
  title: string;
  emoji: string;
  category: string;
  readMinutes: number;
  body: string;
  tip: string;
};

export const ACADEMY: LearnArticle[] = [
  {
    slug: "understanding-your-cycle",
    title: "Understanding Your Menstrual Cycle",
    emoji: "🩸",
    category: "Menstrual Health",
    readMinutes: 4,
    body: "Your cycle has four phases: menstrual, follicular, ovulatory, and luteal. Hormones rise and fall through each, affecting energy, mood, skin and appetite. Tracking helps you anticipate changes and spot irregularities early.",
    tip: "Log your cycle for 3 months to reveal your personal patterns.",
  },
  {
    slug: "hormones-101",
    title: "Hormones 101 for Women",
    emoji: "⚗️",
    category: "Hormonal Health",
    readMinutes: 5,
    body: "Estrogen, progesterone, testosterone, thyroid and insulin all interact to influence your health. Imbalances can show up as skin, hair, mood, weight or cycle changes. Lifestyle, sleep and nutrition strongly support hormonal balance.",
    tip: "Prioritize 7–9 hours of sleep — it's foundational for hormone health.",
  },
  {
    slug: "bone-health",
    title: "Protecting Your Bones for Life",
    emoji: "🦴",
    category: "Menopause",
    readMinutes: 4,
    body: "Bone density peaks in your late 20s then gradually declines, faster after menopause. Weight-bearing exercise, adequate calcium and vitamin D, and avoiding smoking help preserve bone strength.",
    tip: "Include strength training at least twice a week.",
  },
  {
    slug: "mental-wellness",
    title: "Caring for Your Mental Wellbeing",
    emoji: "💗",
    category: "Mental Wellness",
    readMinutes: 4,
    body: "Mood naturally shifts with hormones, stress and life stages. Regular movement, connection, mindfulness and good sleep build resilience. Persistent low mood or anxiety deserves professional support — it's a sign of strength to reach out.",
    tip: "Try a 3-minute breathing exercise when you feel overwhelmed.",
  },
];

export const QUIZZES = [
  {
    slug: "cycle-basics",
    title: "Cycle Basics Quiz",
    emoji: "🧠",
    questions: [
      {
        q: "Ovulation usually occurs about how many days before the next period?",
        options: ["7 days", "14 days", "21 days", "2 days"],
        answer: 1,
      },
      {
        q: "Which nutrient is especially important with heavy periods?",
        options: ["Vitamin C", "Iron", "Vitamin K", "Zinc"],
        answer: 1,
      },
      {
        q: "How long without a period defines menopause?",
        options: ["3 months", "6 months", "12 months", "24 months"],
        answer: 2,
      },
    ],
  },
];

export const COMMUNITY_SPACES = [
  { slug: "pcos", name: "PCOS Support", emoji: "🧬" },
  { slug: "pregnancy", name: "Pregnancy", emoji: "🤰" },
  { slug: "new-mothers", name: "New Mothers", emoji: "🍼" },
  { slug: "menopause", name: "Menopause", emoji: "🌸" },
  { slug: "wellness", name: "General Wellness", emoji: "💗" },
];

export const PREGNANCY_WEEKS: { week: number; size: string; note: string }[] = [
  { week: 4, size: "Poppy seed", note: "Implantation complete; take folic acid daily." },
  { week: 8, size: "Raspberry", note: "Major organs forming; manage nausea with small meals." },
  { week: 12, size: "Lime", note: "End of first trimester; risk of miscarriage drops." },
  { week: 16, size: "Avocado", note: "You may feel first movements soon." },
  { week: 20, size: "Banana", note: "Anatomy scan around now; halfway there!" },
  { week: 24, size: "Corn", note: "Baby's hearing develops; monitor for swelling." },
  { week: 28, size: "Eggplant", note: "Third trimester begins; start kick counts." },
  { week: 32, size: "Squash", note: "Baby gaining weight; watch for preeclampsia signs." },
  { week: 36, size: "Romaine lettuce", note: "Pack your hospital bag." },
  { week: 40, size: "Watermelon", note: "Full term — labor could begin any time." },
];

export const HOSPITAL_BAG = [
  "ID and insurance/hospital documents",
  "Birth plan copies",
  "Comfortable robe & socks",
  "Toiletries & lip balm",
  "Phone charger",
  "Going-home outfit for you",
  "Baby onesie, hat & blanket",
  "Car seat installed",
  "Nursing bra & pads",
  "Snacks & water bottle",
];
