"use strict";
// Chinese text lives in the HTML; English translations use the same stable keys.
const translations = {
  en: {
    skip: "Skip to content",
    nav_research: "Research",
    nav_projects: "Projects",
    nav_notes: "Notes",
    nav_contact: "Contact",
    affiliation: "PHD STUDENT · XI’AN JIAOTONG UNIVERSITY",
    name: "Darrick Li",
    name_secondary: "黎凡玮",
    hero_statement: "Understand intelligence.\nBuild the systems around it.",
    hero_description:
      "From economics and finance to AI agents, mechanism design, and blockchain. I study how agents act — and the incentives, permissions, and trust that make those actions possible.",
    explore: "Explore my research",
    portrait_note: "A researcher’s curiosity. A builder’s mindset.",
    age: "years old",
    journey_14: "Young Gifted Class · Entered university",
    journey_21: "Began my PhD",
    journey_label: "EXPLORING THE INTERSECTION",
    about_heading: "Stay curious.\nKeep building.",
    research_heading: "Questions, turned into research.",
    research_aside: "Mechanism design · Reproducible experiments",
    diagram_1: "Randomized auction",
    diagram_2: "Platform-mediated resale",
    diagram_3: "Official exchange",
    diagram_info: "Information disclosure",
    diagram_value: "Continuation value",
    thesis_label: "UNDERGRADUATE THESIS / PUBLIC",
    thesis_title:
      "Joint mechanism design for randomized auctions, official exchange, and platform-mediated resale",
    thesis_description:
      "The option to resell or exchange an item changes what buyers are willing to pay upfront. I bring allocation, disclosure, resale, and exchange into one framework to study how a platform should jointly design its rules.",
    finding_1: "Market scenarios × disclosure regimes",
    finding_2:
      "Scenario–environment combinations with partial disclosure ranked most profitable",
    thesis_boundary:
      "Numerical findings within the studied mechanism family and Monte Carlo settings, not general theorems for arbitrary markets.",
    thesis_repo: "Code & reproduction",
    thesis_pdf: "Read the thesis",
    interests_label: "ALSO EXPLORING",
    interests:
      "Trustworthy agents & authorization / Distributed systems & blockchain / Digital asset markets",
    projects_heading: "Ideas, tested in practice.",
    all_projects: "All public projects ↗",
    content_loading: "Loading projects…",
    notes_heading: "Leave a trail of learning.",
    notes_intro:
      "Notes on what I understand, and questions I am still working through.",
    gallery_heading: "Beyond the screen.",
    gallery_aside: "A few moments from life",
    contact_heading: "Good questions deserve company.",
    contact_description:
      "Let’s talk about AI agents, mechanism design, Web3, or an idea worth building.",
    zhihu: "Zhihu ↗",
    cv_label: "CV / PDF",
    updated: "Updated · September 2026",
    back_top: "Back to top ↑",
  },
  zh: {},
};
for (const element of document.querySelectorAll("[data-i18n]")) {
  translations.zh[element.dataset.i18n] = element.innerText;
}
const preference = {
  get(key) {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, value);
    } catch {
      /* Storage can be disabled. */
    }
  },
};
let language = "zh";
let requestController;
const cache = new Map();
const escapeHTML = (text) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );
// Tokenize links BEFORE rendering. Do not run URL replacements on generated HTML.
function inlineMarkdown(text) {
  const pattern =
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|https?:\/\/[^\s<>]+|\*\*([^*]+)\*\*|`([^`]+)`/g;
  let result = "",
    previous = 0;
  for (const match of text.matchAll(pattern)) {
    result += escapeHTML(text.slice(previous, match.index));
    if (match[1])
      result += `<a href="${escapeHTML(match[2])}" target="_blank" rel="noopener noreferrer">${escapeHTML(match[1])}</a>`;
    else if (match[3]) result += `<strong>${escapeHTML(match[3])}</strong>`;
    else if (match[4]) result += `<code>${escapeHTML(match[4])}</code>`;
    else
      result += `<a href="${escapeHTML(match[0])}" target="_blank" rel="noopener noreferrer">${escapeHTML(match[0])}</a>`;
    previous = match.index + match[0].length;
  }
  return result + escapeHTML(text.slice(previous));
}
function markdown(text) {
  let output = "",
    paragraph = [],
    inList = false;
  const flushParagraph = () => {
    if (paragraph.length) {
      output += `<p>${inlineMarkdown(paragraph.join(" "))}</p>`;
      paragraph = [];
    }
  };
  const closeList = () => {
    if (inList) {
      output += "</ul>";
      inList = false;
    }
  };
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      closeList();
      continue;
    }
    if (/^#{1,3} /.test(line)) {
      flushParagraph();
      closeList();
      output += `<h3>${inlineMarkdown(line.replace(/^#{1,3} /, ""))}</h3>`;
      continue;
    }
    if (line.startsWith("- ")) {
      flushParagraph();
      if (!inList) {
        output += "<ul>";
        inList = true;
      }
      output += `<li>${inlineMarkdown(line.slice(2))}</li>`;
      continue;
    }
    closeList();
    paragraph.push(line);
  }
  flushParagraph();
  closeList();
  return output;
}
function projectCards(text) {
  return text
    .split(/^## /m)
    .slice(1)
    .map((block, index) => {
      const [title, ...body] = block.split("\n");
      return `<article class="project-card"><span class="project-number" aria-hidden="true">0${index + 1}</span><h3>${escapeHTML(title.trim())}</h3>${markdown(body.join("\n"))}</article>`;
    })
    .join("");
}
async function loadContent(lang) {
  if (requestController) requestController.abort();
  const controller = new AbortController();
  requestController = controller;
  const sections = [
    ["home", "profile"],
    ["projects", "projects"],
    ["notes", "notes"],
  ];
  await Promise.all(
    sections.map(async ([id, file]) => {
      const element = document.getElementById(`${id}-content`);
      element.setAttribute("aria-busy", "true");
      // Clear the previous language while new content loads; avoid mixed-language races.
      element.textContent = lang === "zh" ? "正在载入…" : "Loading…";
      try {
        const path = `content/${lang}/${file}.md`;
        let text = cache.get(path);
        if (!text) {
          const response = await fetch(path, { signal: controller.signal });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          text = await response.text();
          cache.set(path, text);
        }
        if (controller.signal.aborted || language !== lang) return;
        element.innerHTML =
          id === "projects" ? projectCards(text) : markdown(text);
      } catch (error) {
        if (error.name === "AbortError" || controller.signal.aborted) return;
        element.replaceChildren();
        const message = document.createElement("p");
        message.textContent =
          lang === "zh"
            ? "内容暂时无法载入。"
            : "This content could not be loaded.";
        const retry = document.createElement("button");
        retry.className = "button";
        retry.textContent = lang === "zh" ? "重新载入" : "Try again";
        retry.addEventListener("click", () => loadContent(language));
        element.append(message, retry);
      } finally {
        if (!controller.signal.aborted) element.removeAttribute("aria-busy");
      }
    }),
  );
}
function updateThemeLabel() {
  const dark = document.documentElement.dataset.theme === "dark";
  const label =
    language === "zh"
      ? dark
        ? "切换到浅色模式"
        : "切换到深色模式"
      : dark
        ? "Switch to light mode"
        : "Switch to dark mode";
  const button = document.getElementById("btn-theme");
  button.setAttribute("aria-label", label);
  button.title = label;
  button.setAttribute("aria-pressed", String(dark));
}
function setLanguage(lang) {
  language = lang === "en" ? "en" : "zh";
  document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const text = translations[language][element.dataset.i18n];
    if (text !== undefined) element.textContent = text;
  });
  document
    .getElementById("btn-zh")
    .setAttribute("aria-pressed", String(language === "zh"));
  document
    .getElementById("btn-en")
    .setAttribute("aria-pressed", String(language === "en"));
  document.querySelectorAll(".gallery img").forEach((image, index) => {
    image.alt =
      language === "zh"
        ? `Darrick 的生活照片 ${index + 1}`
        : `A moment from Darrick’s life, photo ${index + 1}`;
  });
  document.querySelector("meta[name=description]").content =
    language === "zh"
      ? "黎凡玮 Darrick Li，西安交通大学博士生。少年班出身，14 岁上大学，21 岁读博。探索 AI Agent、机制设计与区块链。"
      : "Darrick Li, PhD student at Xi’an Jiaotong University. Entered university at 14 and began a PhD at 21. Exploring AI agents, mechanism design, and blockchain.";
  preference.set("lang", language);
  updateThemeLabel();
  loadContent(language);
}
function setTheme(theme) {
  document.documentElement.dataset.theme = theme === "dark" ? "dark" : "light";
  document.querySelector("meta[name=theme-color]").content =
    theme === "dark" ? "#151e1a" : "#f5f4ee";
  preference.set("theme", theme);
  updateThemeLabel();
}
function init() {
  document
    .getElementById("btn-en")
    .addEventListener("click", () => setLanguage("en"));
  document
    .getElementById("btn-zh")
    .addEventListener("click", () => setLanguage("zh"));
  document
    .getElementById("btn-theme")
    .addEventListener("click", () =>
      setTheme(
        document.documentElement.dataset.theme === "dark" ? "light" : "dark",
      ),
    );
  setTheme(preference.get("theme") || "light");
  const queryLanguage = new URLSearchParams(location.search).get("lang");
  setLanguage(queryLanguage || preference.get("lang") || "zh");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting) {
            document.querySelectorAll("nav a").forEach((link) => {
              if (link.hash === `#${entry.target.id}`)
                link.setAttribute("aria-current", "location");
              else link.removeAttribute("aria-current");
            });
          }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section));
  }
}
if (typeof document !== "undefined") init();
