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

const ADMIN_ACCOUNTS = [{ username: "bte4wz", password: "bte4wz2028" }];
const PROFESSOR_STORAGE_KEY = "layuplist:professors";
const AUTH_STORAGE_KEY = "layuplist:isAuthed";

const defaultProfessors = [
  {
    name: "John C Harrison",
    courses: ["Federal Courts"],
    gpa: 3.65,
    reviews: [
      { student: "3L Litigator", text: "Crystal-clear explanations of Article III doctrine. Cold calls are tough but fair." },
      { student: "2L Transfer", text: "Heavy reading load, yet curve-friendly. Great for clerkship prep." },
    ],
  },
  {
    name: "Aditya Bamzai",
    courses: ["Civil Procedure", "Administrative Law", "Computer Crime"],
    gpa: 3.53,
    reviews: [
      { student: "1L Section C", text: "Uses hypotheticals nonstop—perfect for exam practice." },
      { student: "Cyber Clinic RA", text: "Admin + tech overlap makes his office hours invaluable." },
    ],
  },
  {
    name: "Barbara Ellen Armacost",
    courses: ["Torts", "Con Law II: Religious Liberty"],
    gpa: 3.495,
    reviews: [
      { student: "1L Evening", text: "Warm teaching style and detailed rubrics kept everyone relaxed." },
      { student: "Rel Liberty Seminar", text: "Expect reflective essays alongside doctrinal analysis." },
    ],
  },
  {
    name: "Paul Gregory Mitchell",
    courses: ["Evidence", "Professional Responsibility"],
    gpa: 3.505,
    reviews: [
      { student: "Trial Advocacy Member", text: "Practical evidence hypos mirror UVA mock trial problems." },
      { student: "Ethics TA", text: "Professional responsibility lectures are concise and practical." },
    ],
  },
  {
    name: "Michael Gilbert",
    courses: ["Regulation of Political Process"],
    gpa: 3.52,
    reviews: [
      { student: "Election Law Society", text: "Policy-focused discussions; bring current-event references." },
      { student: "Journal Note Writer", text: "Provides thoughtful feedback on research topics." },
    ],
  },
  {
    name: "Benjamin Ryan Sachs",
    courses: ["Professional Responsibility"],
    gpa: 3.51,
    reviews: [
      { student: "Ethics Section", text: "Stories from practice keep dry material engaging." },
      { student: "Public Service Fellow", text: "Accommodating to externship schedules." },
    ],
  },
  {
    name: "Josh Bowers",
    courses: ["Criminal Procedure Survey"],
    gpa: 3.54,
    reviews: [
      { student: "Public Defender Intern", text: "Great framing of practical defense strategies." },
      { student: "2L Spring", text: "Calls on everyone eventually—brief the cases well." },
    ],
  },
  {
    name: "Darryl Keith Brown",
    courses: ["Criminal Law", "Criminal Adjudication"],
    gpa: 3.5,
    reviews: [
      { student: "1L Prosecutor", text: "Balanced between theory and policy critiques." },
      { student: "JAG Scholar", text: "Exam focuses on applying doctrine, not rote recall." },
    ],
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

export default function LayupList() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [professorData, setProfessorData] = React.useState(() => {
    const stored = localStorage.getItem(PROFESSOR_STORAGE_KEY);
    try {
      return stored ? JSON.parse(stored) : defaultProfessors;
    } catch (error) {
      console.warn("Failed to parse stored professors", error);
      return defaultProfessors;
    }
  });
  const [isAuthed, setIsAuthed] = React.useState(() => localStorage.getItem(AUTH_STORAGE_KEY) === "true");
  const [loginForm, setLoginForm] = React.useState({ username: "", password: "", error: "" });
  const [newProfessor, setNewProfessor] = React.useState({
    name: "",
    courses: "",
    gpa: "",
    reviewer: "",
    review: "",
  });
  const [newReview, setNewReview] = React.useState({ professorName: "", student: "", text: "" });
  const [formMessage, setFormMessage] = React.useState("");

  React.useEffect(() => {
    localStorage.setItem(PROFESSOR_STORAGE_KEY, JSON.stringify(professorData));
  }, [professorData]);

  const professorsByGpa = React.useMemo(() => [...professorData].sort((a, b) => b.gpa - a.gpa), [professorData]);
  const filteredProfessors = React.useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return professorsByGpa;
    return professorsByGpa.filter((professor) => {
      const inName = professor.name.toLowerCase().includes(query);
      const inCourse = professor.courses.some((course) => course.toLowerCase().includes(query));
      return inName || inCourse;
    });
  }, [professorsByGpa, searchTerm]);

  const handleLogin = (event) => {
    event.preventDefault();
    const { username, password } = loginForm;
    const valid = ADMIN_ACCOUNTS.some((account) => account.username === username && account.password === password);
    if (valid) {
      setIsAuthed(true);
      localStorage.setItem(AUTH_STORAGE_KEY, "true");
      setLoginForm({ username: "", password: "", error: "" });
    } else {
      setLoginForm((prev) => ({ ...prev, error: "Invalid credentials. Please try again." }));
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const handleNewProfessorChange = (event) => {
    const { name, value } = event.target;
    setNewProfessor((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewReviewChange = (event) => {
    const { name, value } = event.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProfessor = (event) => {
    event.preventDefault();
    setFormMessage("");
    if (!newProfessor.name || !newProfessor.courses || !newProfessor.gpa || !newProfessor.reviewer || !newProfessor.review) {
      setFormMessage("Please fill in every field before adding a professor.");
      return;
    }

    const parsedGpa = parseFloat(newProfessor.gpa);
    if (Number.isNaN(parsedGpa)) {
      setFormMessage("GPA must be a number.");
      return;
    }

    const courses = newProfessor.courses.split(",").map((course) => course.trim()).filter(Boolean);
    if (courses.length === 0) {
      setFormMessage("Include at least one course (comma-separated).");
      return;
    }

    const alreadyExists = professorData.some((professor) => professor.name.toLowerCase() === newProfessor.name.toLowerCase());
    if (alreadyExists) {
      setFormMessage("That professor already exists. Add a review instead.");
      return;
    }

    const newProfile = {
      name: newProfessor.name.trim(),
      courses,
      gpa: parsedGpa,
      reviews: [{ student: newProfessor.reviewer.trim(), text: newProfessor.review.trim() }],
    };

    setProfessorData((prev) => [...prev, newProfile]);
    setNewProfessor({ name: "", courses: "", gpa: "", reviewer: "", review: "" });
    setFormMessage("Professor added successfully.");
  };

  const handleAddReview = (event) => {
    event.preventDefault();
    setFormMessage("");
    const { professorName, student, text } = newReview;
    if (!professorName || !student || !text) {
      setFormMessage("Provide the professor, student name, and review text.");
      return;
    }

    setProfessorData((prev) =>
      prev.map((professor) => {
        if (professor.name === professorName) {
          return {
            ...professor,
            reviews: [...professor.reviews, { student: student.trim(), text: text.trim() }],
          };
        }
        return professor;
      }),
    );
    setNewReview({ professorName: "", student: "", text: "" });
    setFormMessage("Review added successfully.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-slate-100 px-6 py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        <header className="text-center">
          <p className="text-sm tracking-wide uppercase text-orange-400">LayupList</p>
          <h1 className="mt-2 text-4xl font-bold text-white sm:text-5xl">UVA Law LayupList</h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-slate-300">
            Search professors, scan their median GPAs, and read UVA student reviews before locking in your class list.
          </p>
          <div className="mt-8">
            <label htmlFor="prof-search" className="sr-only">
              Search professors or courses
            </label>
            <div className="relative mx-auto max-w-2xl">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
              <input
                id="prof-search"
                type="search"
                placeholder="Search professors or courses…"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-12 py-4 text-base text-white placeholder:text-slate-400 focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400/40"
              />
            </div>
            <p className="mt-3 text-sm text-slate-400">
              Showing {filteredProfessors.length} of {professorsByGpa.length} professors
            </p>
          </div>
        </header>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/30">
          {isAuthed ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-orange-300">Admin Mode</p>
                  <h2 className="text-2xl font-semibold text-white">Add Professors & Reviews</h2>
                  <p className="text-sm text-slate-300">Add-only access keeps existing data safe.</p>
                </div>
                <button
                  className="rounded-xl border border-white/20 px-4 py-2 text-xs text-slate-200 hover:border-orange-300 hover:text-white"
                  onClick={handleLogout}
                >
                  Log out
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <form onSubmit={handleAddProfessor} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <h3 className="text-lg font-semibold text-white">Add Professor</h3>
                  <input
                    type="text"
                    name="name"
                    value={newProfessor.name}
                    onChange={handleNewProfessorChange}
                    placeholder="Professor name"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    required
                  />
                  <input
                    type="text"
                    name="courses"
                    value={newProfessor.courses}
                    onChange={handleNewProfessorChange}
                    placeholder="Courses (comma-separated)"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    required
                  />
                  <input
                    type="number"
                    name="gpa"
                    step="0.001"
                    value={newProfessor.gpa}
                    onChange={handleNewProfessorChange}
                    placeholder="Median GPA"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    required
                  />
                  <input
                    type="text"
                    name="reviewer"
                    value={newProfessor.reviewer}
                    onChange={handleNewProfessorChange}
                    placeholder="First review – student name"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    required
                  />
                  <textarea
                    name="review"
                    value={newProfessor.review}
                    onChange={handleNewProfessorChange}
                    placeholder="First review text"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    rows="3"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-orange-500 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
                  >
                    Add Professor
                  </button>
                </form>

                <form onSubmit={handleAddReview} className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/50 p-4">
                  <h3 className="text-lg font-semibold text-white">Add Review</h3>
                  <select
                    name="professorName"
                    value={newReview.professorName}
                    onChange={handleNewReviewChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white"
                    required
                  >
                    <option value="">Select professor…</option>
                    {professorData.map((professor) => (
                      <option key={`review-${professor.name}`} value={professor.name}>
                        {professor.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    name="student"
                    value={newReview.student}
                    onChange={handleNewReviewChange}
                    placeholder="Student name"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    required
                  />
                  <textarea
                    name="text"
                    value={newReview.text}
                    onChange={handleNewReviewChange}
                    placeholder="Review text"
                    className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                    rows="4"
                    required
                  />
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-teal-500 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
                  >
                    Add Review
                  </button>
                </form>
              </div>

              {formMessage && <p className="text-sm text-orange-300">{formMessage}</p>}
            </div>
          ) : (
            <form
              onSubmit={handleLogin}
              className="space-y-3 rounded-2xl border border-white/10 bg-slate-900/40 p-6 text-center shadow-xl shadow-black/30"
            >
              <p className="text-xs uppercase tracking-wide text-orange-300">Admin Access</p>
              <h2 className="text-2xl font-semibold text-white">Log in to add profiles or reviews</h2>
              <input
                type="text"
                placeholder="Username"
                value={loginForm.username}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, username: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500"
                required
              />
              {loginForm.error && <p className="text-sm text-red-400">{loginForm.error}</p>}
              <button
                type="submit"
                className="w-full rounded-xl bg-orange-500 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
              >
                Log In
              </button>
            </form>
          )}
        </section>

        <section className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl shadow-black/30">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-orange-300">Professor Profiles</p>
              <h2 className="text-2xl font-semibold text-white">Median Classes & Student Reviews</h2>
              <p className="text-sm text-slate-300">
                Every profile is hard-wired for now—perfect for validating the concept before you plug in data feeds.
              </p>
            </div>
            <div className="rounded-full bg-slate-800 px-4 py-2 text-center text-xs text-slate-200">
              {filteredProfessors.length === professorsByGpa.length ? "Explore them all" : "Filtered view"}
            </div>
          </div>

          {filteredProfessors.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-6 text-center text-sm text-slate-300">
              No professors match that search yet. Try another name, course, or clear the query.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredProfessors.map((professor, idx) => (
                <article
                  key={professor.name}
                  className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 shadow-md shadow-black/20"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-orange-200">Rank #{idx + 1}</p>
                      <h3 className="text-lg font-semibold text-white">{professor.name}</h3>
                      <p className="text-xs text-slate-400">
                        Median GPA {professor.gpa.toFixed(3)} · {professor.courses.length} classes tracked
                      </p>
                    </div>
                    <div className="rounded-2xl bg-slate-900 px-3 py-1 text-sm font-semibold text-green-300">
                      {professor.gpa.toFixed(3)}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wide text-slate-400">Median Classes</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {professor.courses.map((course) => (
                        <span
                          key={`${professor.name}-${course}`}
                          className="rounded-full bg-slate-950/40 px-3 py-1 text-xs text-slate-100"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/5 bg-slate-900/50 p-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400">Student Reviews</p>
                    <div className="mt-2 space-y-2 text-sm text-slate-100">
                      {professor.reviews.map((review, reviewIdx) => (
                        <p key={`${professor.name}-review-${reviewIdx}`}>
                          <span className="font-semibold text-orange-200">{review.student}:</span> {review.text}
                        </p>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
