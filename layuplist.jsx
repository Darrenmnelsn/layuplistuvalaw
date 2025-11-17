import React from "react";

const schedule = [
  {
    semester: "1L Fall",
    courses: [
      { name: "Contracts", credits: 4, gpa: 3.5 },
      { name: "Torts", credits: 4, gpa: 3.5 },
      { name: "Civil Procedure", credits: 4, gpa: 3.5 },
    ],
  },
  {
    semester: "1L Spring Option 1 (Litigation)",
    courses: [
      { name: "Con Law", credits: 4, gpa: 3.5 },
      { name: "Evidence", credits: 4, gpa: 3.6 },
      { name: "Professional Responsibility", credits: 3, gpa: 3.65 },
    ],
  },
  {
    semester: "1L Spring Option 2 (Business)",
    courses: [
      { name: "Con Law", credits: 4, gpa: 3.5 },
      { name: "Corporations", credits: 4, gpa: 3.7 },
      { name: "Intro to Law & Business", credits: 3, gpa: 3.65 },
    ],
  },
  {
    semester: "2L Fall",
    courses: [
      { name: "Corporations / Business Associations", credits: 4, gpa: 3.7 },
      { name: "Federal Income Tax", credits: 3, gpa: 3.7 },
      { name: "Optional Elective", credits: 2, gpa: 3.55 },
    ],
  },
  {
    semester: "2L Spring",
    courses: [
      { name: "Bankruptcy / Corporate Finance", credits: 4, gpa: 3.65 },
      { name: "Deals / M&A", credits: 3, gpa: 3.7 },
      { name: "Optional Seminar", credits: 2, gpa: 3.6 },
    ],
  },
  {
    semester: "3L Fall",
    courses: [
      { name: "Corporate Law Seminar", credits: 4, gpa: 3.7 },
      { name: "Tax & Business", credits: 3, gpa: 3.7 },
      { name: "Optional Seminar / Independent Study", credits: 2, gpa: 3.6 },
    ],
  },
  {
    semester: "3L Spring",
    courses: [
      { name: "Trial / Advocacy Clinic", credits: 4, gpa: 3.55 },
      { name: "Legal History / Policy Seminar", credits: 3, gpa: 3.6 },
      { name: "Optional Elective", credits: 2, gpa: 3.65 },
    ],
  },
];

const professors = [
  {
    name: "John C Harrison",
    courses: ["Federal Courts"],
    gpa: 3.65,
  },
  {
    name: "Aditya Bamzai",
    courses: ["Civil Procedure", "Administrative Law", "Computer Crime"],
    gpa: 3.53,
  },
  {
    name: "Barbara Ellen Armacost",
    courses: ["Torts", "Con Law II: Religious Liberty"],
    gpa: 3.495,
  },
  {
    name: "Paul Gregory Mitchell",
    courses: ["Evidence", "Professional Responsibility"],
    gpa: 3.505,
  },
  {
    name: "Michael Gilbert",
    courses: ["Regulation of Political Process"],
    gpa: 3.52,
  },
  {
    name: "Benjamin Ryan Sachs",
    courses: ["Professional Responsibility"],
    gpa: 3.51,
  },
  {
    name: "Josh Bowers",
    courses: ["Criminal Procedure Survey"],
    gpa: 3.54,
  },
  {
    name: "Darryl Keith Brown",
    courses: ["Criminal Law", "Criminal Adjudication"],
    gpa: 3.5,
  },
];

const GPA_BUCKETS = [
  { min: 3.65, label: "3.65 – 3.75", color: "#006400" },
  { min: 3.55, label: "3.55 – 3.64", color: "#90EE90" },
  { min: 3.45, label: "3.45 – 3.54", color: "#FFFF99" },
  { min: 3.35, label: "3.35 – 3.44", color: "#FFA500" },
  { min: -Infinity, label: "< 3.35", color: "#FF6347" },
];

const gpaToColor = (gpa) => GPA_BUCKETS.find((bucket) => gpa >= bucket.min)?.color ?? "#CCCCCC";

const MAX_CREDITS = Math.max(
  12,
  ...schedule.map((semester) => semester.courses.reduce((sum, course) => sum + course.credits, 0)),
);

const formatCourseList = (courses) => (courses.length > 1 ? courses.join(", ") : courses[0]);

export default function LayupList() {
  const professorsByGpa = [...professors].sort((a, b) => b.gpa - a.gpa);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10">
          <p className="text-sm tracking-wide uppercase text-orange-400">LayupList</p>
          <h1 className="text-4xl font-bold text-white">UVA Law LayupList</h1>
          <p className="mt-3 max-w-3xl text-base text-slate-300">
            Track UVA Law&apos;s recommended schedule and scout the professors with the most generous median GPAs.
            Each course block scales by credit load and each faculty card highlights course coverage plus average GPAs.
          </p>
        </header>

        <section className="space-y-6 rounded-3xl bg-white/5 p-6 shadow-xl shadow-black/40 backdrop-blur">
          {schedule.map((semester) => {
            const totalCredits = semester.courses.reduce((sum, course) => sum + course.credits, 0);
            const remainingWidth = Math.max(0, ((MAX_CREDITS - totalCredits) / MAX_CREDITS) * 100);

            return (
              <article
                key={semester.semester}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-orange-300/60"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs tracking-wide text-orange-300 uppercase">Semester</p>
                    <h2 className="text-xl font-semibold text-white">{semester.semester}</h2>
                  </div>
                  <div className="text-sm text-slate-300">
                    Total Credits:{" "}
                    <span className="font-semibold text-white">
                      {totalCredits}
                      {totalCredits < MAX_CREDITS ? ` / ${MAX_CREDITS}` : ""}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex h-28 items-stretch rounded-xl border border-white/5 bg-slate-950/30">
                  {semester.courses.map((course) => {
                    const widthPercentage = (course.credits / MAX_CREDITS) * 100;
                    const color = gpaToColor(course.gpa);
                    const useLightText = course.gpa >= 3.55;

                    return (
                      <div
                        key={`${semester.semester}-${course.name}`}
                        className="flex flex-1 flex-col justify-center border-r border-white/10 px-2 text-center last:border-r-0"
                        style={{ width: `${widthPercentage}%`, backgroundColor: color }}
                        title={`${course.name}: ${course.credits} credits • Median GPA ${course.gpa.toFixed(2)}`}
                      >
                        <p className={`text-sm font-semibold ${useLightText ? "text-white" : "text-black"}`}>
                          {course.name}
                        </p>
                        <p className={`text-xs ${useLightText ? "text-white/80" : "text-black/80"}`}>
                          {course.credits} credits
                        </p>
                        <p className={`text-xs font-semibold ${useLightText ? "text-white" : "text-black"}`}>
                          GPA ~ {course.gpa.toFixed(2)}
                        </p>
                      </div>
                    );
                  })}
                  {remainingWidth > 0 && (
                    <div
                      className="hidden h-full items-center justify-center text-xs text-slate-500 md:flex"
                      style={{ width: `${remainingWidth}%` }}
                    >
                      Free Electives / Clinics
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        <footer className="mt-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Median GPA Legend</p>
            <p className="text-xs text-slate-300">Color-coding mirrors the Matplotlib heatmap.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {GPA_BUCKETS.map((bucket) => (
              <div key={bucket.label} className="flex items-center gap-2 rounded-full bg-slate-900/60 px-3 py-1">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: bucket.color }} />
                <span className="text-xs text-slate-100">{bucket.label}</span>
              </div>
            ))}
          </div>
        </footer>

        <section className="mt-10 rounded-3xl border border-orange-300/30 bg-slate-900/40 p-6 shadow-lg shadow-black/30">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-orange-300">Faculty Intel</p>
              <h2 className="text-2xl font-semibold text-white">Highest Median GPA Professors</h2>
              <p className="text-sm text-slate-300">
                Sorted by reported UVA median GPAs. Use this as a layup list when planning electives or clinics.
              </p>
            </div>
            <div className="rounded-full bg-slate-800 px-4 py-2 text-center text-xs text-slate-200">
              {professorsByGpa.length} professors tracked
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {professorsByGpa.map((professor, idx) => (
              <article
                key={professor.name}
                className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-md shadow-black/20"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-orange-200">Rank #{idx + 1}</p>
                    <h3 className="text-lg font-semibold text-white">{professor.name}</h3>
                  </div>
                  <div className="rounded-2xl bg-slate-900 px-3 py-1 text-sm font-semibold text-green-300">
                    {professor.gpa.toFixed(3)}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">Courses</p>
                  <p className="text-sm text-slate-100">{formatCourseList(professor.courses)}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
