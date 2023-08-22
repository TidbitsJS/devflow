import { HotNetworkQuestion, MockUserData, SidebarLink } from "@/types";

export const themes = [
  { value: "light", label: "Light", icon: "/assets/icons/sun.svg" },
  { value: "dark", label: "Dark", icon: "/assets/icons/moon.svg" },
  { value: "system", label: "System", icon: "/assets/icons/computer.svg" },
];

export const sidebarLinks: SidebarLink[] = [
  {
    imgURL: "/assets/icons/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/icons/users.svg",
    route: "/community",
    label: "Community",
  },
  {
    imgURL: "/assets/icons/star.svg",
    route: "/collection",
    label: "Collections",
  },
  {
    imgURL: "/assets/icons/suitcase.svg",
    route: "/jobs",
    label: "Find Jobs",
  },
  {
    imgURL: "/assets/icons/tag.svg",
    route: "/tags",
    label: "Tags",
  },
  {
    imgURL: "/assets/icons/user.svg",
    route: "/profile",
    label: "Profile",
  },
  {
    imgURL: "/assets/icons/question.svg",
    route: "/ask-question",
    label: "Ask a question",
  },
];

export const filterLinks: string[] = [
  "Newest",
  "Interesting",
  "Frequent",
  "Unanswered",
];

export const tagsFilterLinks: string[] = ["Popular", "Name", "New"];

export const hotNetworkQuestion: HotNetworkQuestion[] = [
  {
    id: 1,
    question:
      "Would it be appropriate to point out an error in another paper during a referee report?",
  },
  {
    id: 2,
    question: "How can an airconditioning machine exist?",
  },
  {
    id: 3,
    question: "Interrogated every time crossing UK Border as citizen",
  },
  {
    id: 4,
    question: "Low digit addition generator",
  },
  {
    id: 5,
    question: "What is an example of 3 numbers that do not make up a vector?",
  },
];

export const mockUserData: MockUserData = {
  companyLink: "jsmastery.pro",
  location: "New York, USA",
  about:
    "I'm a Product Designer based in New York, USA. I specialise in UX/UI design, brand strategy, and web dev. I'm always striving to grow and learn something new & I don't take myself too seriously",
  stats: {
    questions: 156,
    answers: 101,
    goldBadges: 15,
    silverBadges: 23,
    bronzeBadges: 38,
  },
  tags: ["html", "css", "javascript"],
};

// Jobs
export const employmentTypes: string[] = [
  "Full Time",
  "Part Time",
  "Contractor",
  "Intern",
];
