import {
  initialEducation,
  initialProfile,
  initialProject,
  initialWorkExperience,
} from "lib/redux/resumeSlice";
import type { Resume } from "lib/redux/types";
import { deepClone } from "lib/deep-clone";

export const END_HOME_RESUME: Resume = {
  profile: {
    name: "Jim Halpert",
    summary:
      "Salesman with a knack for building relationships, closing deals, and occasionally pulling pranks. Passionate about client satisfaction and innovative sales strategies.",
    email: "jim@dundermifflin.com",
    phone: "717-555-0100",
    location: "Scranton, PA",
    url: "linkedin.com/in/jim",
  },
  workExperiences: [
    {
      company: "Dunder Mifflin Paper Company",
      jobTitle: "Sales Representative",
      date: "2001 - Present",
      descriptions: [
        "Increased regional sales revenue by 25% through personalized client strategies and effective relationship management.",
    "Consistently ranked as one of the top-performing sales representatives in the Scranton branch for over 10 years.",
    "Developed and maintained a portfolio of 50+ high-value clients, ensuring long-term satisfaction and retention.",
    "Played a key role in landing the branch's largest account, contributing significantly to the company's profitability.",
    "Mentored new sales staff, fostering a collaborative team environment and improving office-wide sales performance.",
      ],
    },
    {
      company: "Athleap (Side Project)",
      jobTitle: "Co-Founder",
      date: "2014 - 2016",
      descriptions: [
        "Developed a sports marketing company focused on connecting athletes with endorsement deals.",
        "Built a client roster of semi-professional and professional athletes, negotiating contracts to maximize their visibility and revenue.",
        "Managed day-to-day operations, overseeing marketing campaigns and client relations.",
      ],
    },
  ],
  educations: [
    {
      school: "Pennsylvania State University",
      degree: "Bachelor of Science in Marketing",
      date: "1997 - 2001",
      gpa: "3.4",
      descriptions: [
        "Active member of the university's sales club, winning regional sales competitions.",
        "Coursework: Sales Strategies, Consumer Psychology, Business Ethics, Marketing Analytics.",
      ],
    },
  ],
  projects: [
    {
      project: "Dunder Mifflin's Largest Client Account",
      date: "2022",
      descriptions: [
        "Secured and managed the largest client account in company history, increasing regional revenue by 35%.",
      ],
    },
  ],
  skills: {
    featuredSkills: [
      { skill: "Sales", rating: 5 },
      { skill: "Marketing", rating: 4 },
      { skill: "Leadership", rating: 4 },
    ],
    descriptions: [
      "Tech: CRM Tools (Salesforce), Microsoft Office Suite, Presentation Software",
      "Soft: Communication, Teamwork, Humor, Adaptability, Creative Problem Solving",
    ],
  },
  custom: {
    descriptions: [
      "Known for building strong client relationships with a personal touch.",
      "Excellent team player and mentor with a talent for keeping workplace morale high.",
    ],
  },
};


export const START_HOME_RESUME: Resume = {
  profile: deepClone(initialProfile),
  workExperiences: END_HOME_RESUME.workExperiences.map(() =>
    deepClone(initialWorkExperience)
  ),
  educations: [deepClone(initialEducation)],
  projects: [deepClone(initialProject)],
  skills: {
    featuredSkills: END_HOME_RESUME.skills.featuredSkills.map((item) => ({
      skill: "",
      rating: item.rating,
    })),
    descriptions: [],
  },
  custom: {
    descriptions: [],
  },
};
