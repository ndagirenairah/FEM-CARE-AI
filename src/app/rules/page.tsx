import Link from "next/link";

const sections = [
  ["1. Eligibility", ["The hackathon is open to developers, students, designers, innovators, entrepreneurs, researchers, and technology enthusiasts. Participants may compete individually or in teams.", "Participants must provide accurate registration information and comply with applicable laws and regulations.", "There is no restriction on the programming language, framework, operating system, or development platform used."]],
  ["2. Project Requirements", ["Projects must address the theme: AI & Emerging Technology for Real-World Impact.", "Projects must demonstrate meaningful technology use to solve a real-world problem and be submitted before the official deadline.", "Participants must provide the problem, proposed solution, technologies used, how the project works, and a working demonstration or presentation when requested. Late projects may be disqualified unless an official extension is granted."]],
  ["3. Use of AI", ["AI coding assistants, generative AI, APIs, open-source models, and other AI technologies are allowed.", "Participants remain responsible for understanding, testing, and taking responsibility for their code and technologies, including compliance with model, API, dataset, library, and service terms and licenses."]],
  ["4. Existing Projects & Intellectual Property", ["Participants must have the right to use and submit every project component, comply with third-party licenses and attribution requirements, and disclose significant pre-existing code or components.", "Participants must not submit another person's work as their own. Participants retain ownership of what they create unless they separately agree otherwise with a sponsor, partner, or other party."]],
  ["5. Code of Conduct", ["Participants must treat everyone with respect, maintain a professional and inclusive environment, and avoid harassment, discrimination, intimidation, threats, cheating, abuse, plagiarism, fraud, impersonation, and deliberate misrepresentation.", "Participants must not disrupt the platform, infrastructure, judging process, or another project. Serious violations may result in disqualification and removal from the event."]],
  ["6. Fair Competition", ["Competition must be fair and honest. Vote, judging, submission, and results manipulation and intentional interference with another project or infrastructure are prohibited.", "Judges and organizers may request clarification, demonstrations, source code, or other evidence. The organizing committee may disqualify rule-breaking projects."]],
  ["7. Prohibited Content & Activities", ["Projects must not promote illegal activity, facilitate criminal behavior, contain malicious or intentionally harmful code, infringe rights, contain hateful, threatening, exploitative, or abusive content, or attack systems without authorization."]],
  ["8. Allowed Technologies", ["Any relevant programming language, framework, AI/ML model or API, open-source software, cloud service, database, hardware, IoT platform, developer tool, third-party API, no-code or low-code platform, or other technology is allowed."]],
  ["9. Organizers' Rights", ["The organizing committee may interpret and enforce these rules, verify submissions and eligibility, disqualify violations, modify event details with reasonable notice, and make final decisions on disputes, eligibility, and violations."]],
  ["10. Acceptance of Rules", ["By registering for and participating in the hackathon, participants acknowledge that they have read, understood, and agreed to follow these rules and the organizing committee's decisions."]],
] as const;

export default function RulesPage() {
  return (
    <main className="min-h-screen bg-rose-50 px-6 py-12 text-slate-800">
      <article className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm ring-1 ring-rose-100 sm:p-12">
        <Link href="/" className="text-sm font-semibold text-pink-700">Back to FemCare AI</Link>
        <h1 className="mt-6 text-3xl font-black text-slate-900">Hackathon Rules</h1>
        <p className="mt-3 text-slate-600">These rules apply to registration and participation in the AI & Emerging Technology for Real-World Impact hackathon.</p>
        <div className="mt-8 space-y-8">
          {sections.map(([heading, paragraphs]) => (
            <section key={heading}>
              <h2 className="text-xl font-bold text-slate-900">{heading}</h2>
              <div className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}