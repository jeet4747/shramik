export const workerProfile = {
  name: "Ramesh Kumar",
  initials: "RK",
  phone: "9876543210",
  location: "Nashik Road, Nashik",
  experience: 3,
  jobsDone: 47,
  rating: 4.7,
  monthEarnings: 18400,
  activeJobs: 2,
  skills: ["Electrician", "Wiring", "Solar Panel", "MCB Fitting"],
  verified: true,
};

export const nearbyJobs = [
  {
    id: 1,
    title: "Wiring Work – 2BHK Flat",
    contractor: "Suresh Constructions",
    verified: true,
    location: "Nashik Road",
    distance: "1.2 km",
    pay: 800,
    skills: ["Electrician", "Wiring"],
  },
  {
    id: 2,
    title: "Plumbing Repair – Society Block C",
    contractor: "Patel Infra Pvt Ltd",
    verified: true,
    location: "Gangapur Road",
    distance: "2.5 km",
    pay: 700,
    skills: ["Plumber"],
  },
  {
    id: 3,
    title: "Solar Panel Installation",
    contractor: "GreenBuild Nashik",
    verified: false,
    location: "Satpur MIDC",
    distance: "3.8 km",
    pay: 1100,
    skills: ["Solar Panel", "Electrician"],
  },
  {
    id: 4,
    title: "Carpenter Work – Office Fit-out",
    contractor: "Shinde Brothers",
    verified: true,
    location: "College Road",
    distance: "0.9 km",
    pay: 900,
    skills: ["Carpenter"],
  },
];

export const myJobs = [
  {
    id: 1,
    title: "Switchboard Repair – 3BHK",
    contractor: "Kulkarni Homes",
    date: "18 Apr 2026",
    pay: 750,
    status: "Completed",
  },
  {
    id: 2,
    title: "Full Wiring – New Villa",
    contractor: "Suresh Constructions",
    date: "20 Apr 2026",
    pay: 800,
    status: "Ongoing",
  },
  {
    id: 3,
    title: "MCB Panel Fitting",
    contractor: "GreenBuild Nashik",
    date: "22 Apr 2026",
    pay: 950,
    status: "Ongoing",
  },
  {
    id: 4,
    title: "Solar Installation – Rooftop",
    contractor: "Patel Infra Pvt Ltd",
    date: "10 Apr 2026",
    pay: 1100,
    status: "Completed",
  },
  {
    id: 5,
    title: "Electrical Inspection",
    contractor: "Shinde Brothers",
    date: "25 Apr 2026",
    pay: 600,
    status: "Pending",
  },
];

export const earningsData = [
  { day: "Mon", amount: 800 },
  { day: "Tue", amount: 0 },
  { day: "Wed", amount: 1100 },
  { day: "Thu", amount: 800 },
  { day: "Fri", amount: 950 },
  { day: "Sat", amount: 750 },
  { day: "Sun", amount: 600 },
];

export const earningsBreakdown = [
  { job: "Full Wiring – New Villa", contractor: "Suresh Constructions", date: "20 Apr", amount: 800 },
  { job: "Solar Installation – Rooftop", contractor: "Patel Infra", date: "19 Apr", amount: 1100 },
  { job: "MCB Panel Fitting", contractor: "GreenBuild", date: "18 Apr", amount: 950 },
  { job: "Switchboard Repair", contractor: "Kulkarni Homes", date: "17 Apr", amount: 750 },
  { job: "Electrical Inspection", contractor: "Shinde Brothers", date: "16 Apr", amount: 600 },
  { job: "Wiring – 1BHK Flat", contractor: "Joshi Realty", date: "14 Apr", amount: 800 },
];

export const contractorProfile = {
  name: "Suresh Contractors Pvt Ltd",
  contact: "Suresh Patil",
  phone: "9823401234",
  activeJobs: 3,
  totalHired: 12,
  pendingApplications: 7,
  monthSpend: 54000,
};

export const workerPool = [
  { id: 1, name: "Ramesh Kumar", initials: "RK", skills: ["Electrician", "Wiring"], rating: 4.7, distance: "1.2 km", phone: "9876543210", available: true },
  { id: 2, name: "Manoj Yadav", initials: "MY", skills: ["Plumber", "Pipe Fitting"], rating: 4.5, distance: "2.1 km", phone: "9823456789", available: true },
  { id: 3, name: "Santosh Shinde", initials: "SS", skills: ["Carpenter", "Furniture"], rating: 4.8, distance: "0.8 km", phone: "9765432100", available: true },
  { id: 4, name: "Dinesh Pawar", initials: "DP", skills: ["Helper", "Loading"], rating: 4.2, distance: "3.4 km", phone: "9812345678", available: false },
  { id: 5, name: "Vijay Kale", initials: "VK", skills: ["Electrician", "Solar Panel"], rating: 4.6, distance: "1.9 km", phone: "9898765432", available: true },
  { id: 6, name: "Prakash More", initials: "PM", skills: ["Plumber", "Drainage"], rating: 4.3, distance: "2.7 km", phone: "9834567890", available: true },
];

export const contractorJobs = [
  { id: 1, title: "Full Wiring – Phase 2 Flats", skill: "Electrician", applicants: 4, status: "Active", location: "Gangapur Road" },
  { id: 2, title: "Plumbing – Block B & C", skill: "Plumber", applicants: 2, status: "Active", location: "Nashik Road" },
  { id: 3, title: "Carpenter Work – Site Office", skill: "Carpenter", applicants: 1, status: "Paused", location: "Satpur MIDC" },
];

export const applicantsMap = {
  1: [
    { id: 1, name: "Ramesh Kumar", rating: 4.7, experience: "3 yrs" },
    { id: 2, name: "Vijay Kale", rating: 4.6, experience: "4 yrs" },
    { id: 3, name: "Anil Desai", rating: 4.4, experience: "2 yrs" },
    { id: 4, name: "Rohit Jadhav", rating: 4.1, experience: "1 yr" },
  ],
  2: [
    { id: 5, name: "Manoj Yadav", rating: 4.5, experience: "5 yrs" },
    { id: 6, name: "Prakash More", rating: 4.3, experience: "3 yrs" },
  ],
  3: [
    { id: 7, name: "Santosh Shinde", rating: 4.8, experience: "6 yrs" },
  ],
};

export const hiredWorkers = [
  { id: 1, name: "Ramesh Kumar", skill: "Electrician", job: "Full Wiring – Phase 2", startDate: "20 Apr 2026", pay: 800, phone: "9876543210" },
  { id: 2, name: "Manoj Yadav", skill: "Plumber", job: "Plumbing – Block B & C", startDate: "19 Apr 2026", pay: 700, phone: "9823456789" },
  { id: 3, name: "Santosh Shinde", skill: "Carpenter", job: "Carpenter Work – Office", startDate: "21 Apr 2026", pay: 900, phone: "9765432100" },
];

export const pendingVerifications = [
  { id: 1, name: "Ankit Bhosale", skill: "Electrician", location: "Nashik Road", submitted: "21 Apr 2026", status: "Pending" },
  { id: 2, name: "Sachin Wagh", skill: "Plumber", location: "Gangapur Road", submitted: "20 Apr 2026", status: "Pending" },
  { id: 3, name: "Raju Jagtap", skill: "Helper", location: "Ozar", submitted: "19 Apr 2026", status: "Pending" },
  { id: 4, name: "Priya Sonawane", skill: "Painter", location: "Deolali", submitted: "18 Apr 2026", status: "Pending" },
  { id: 5, name: "Deepak Kamble", skill: "Carpenter", location: "Satpur MIDC", submitted: "17 Apr 2026", status: "Pending" },
];

export const activityFeed = [
  { id: 1, text: "Ramesh Kumar ne Nashik mein wiring job accept ki", time: "2 min ago", type: "job" },
  { id: 2, text: "New contractor registered: Apex Build Solutions", time: "15 min ago", type: "contractor" },
  { id: 3, text: "Manoj Yadav ka verification approved", time: "32 min ago", type: "verify" },
  { id: 4, text: "Suresh Constructions ne 3 workers hire kiye", time: "1 hr ago", type: "hire" },
  { id: 5, text: "Solar Panel job completed in Satpur by Vijay Kale", time: "2 hr ago", type: "complete" },
  { id: 6, text: "New job posted: Plumbing – Gangapur Road", time: "3 hr ago", type: "job" },
  { id: 7, text: "Santosh Shinde rated 5★ by Shinde Brothers", time: "4 hr ago", type: "rating" },
  { id: 8, text: "New contractor registered: Joshi Infra Pvt Ltd", time: "5 hr ago", type: "contractor" },
];

export const cityData = [
  { city: "Nashik", emoji: "🟢", status: "Active", workers: 1240, jobs: 34 },
  { city: "Pune", emoji: "🟡", status: "Coming Soon", workers: null, jobs: null },
  { city: "Mumbai", emoji: "🟡", status: "Coming Soon", workers: null, jobs: null },
  { city: "Aurangabad", emoji: "⚪", status: "Planned", workers: null, jobs: null },
];

export const skillOptions = ["All Skills", "Electrician", "Plumber", "Carpenter", "Helper", "Painter", "Solar Panel"];
