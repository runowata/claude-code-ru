// Lessons and Electives in the Level folders follow the lesson anatomy
// (CONTRIBUTING.md#lessons): the H1, one <sub> header line, the six fixed
// slots in order, the optional Watch out and Go further slots with at most
// three items each, the Check slot's order, and the footer.
import { readText } from '../lib/tree.mjs';
import { outsideFences } from '../lib/markdown.mjs';

export const id = 'lesson-lint';
export const modes = ['pr', 'release'];

// Russian translation: slot names, header and footer words follow .translation/GLOSSARY.md.
const LEVELS = { beginner: 'Начальный уровень', intermediate: 'Средний уровень', advanced: 'Продвинутый уровень' };
const FIXED = ['Цель', 'Что понадобится', 'Идея', 'Разбор на примере', 'Ваша очередь', 'Проверка'];
const OPTIONAL = ['Осторожно', 'Дальше'];
const LESSON = /^docs\/(beginner|intermediate|advanced)\/(\d{2})-[^/]+\.md$/;
const ELECTIVE = /^docs\/(beginner|intermediate|advanced)\/electives\/[^/]+\.md$/;

export function lessonKind(path) {
  const l = path.match(LESSON);
  if (l) return { level: l[1], number: Number(l[2]), id: `${l[1][0]}-${Number(l[2])}`, elective: false };
  const e = path.match(ELECTIVE);
  if (e) return { level: e[1], elective: true };
  return null;
}

const listItems = (lines) => lines.filter(({ line }) => /^([-*+]|\d+[.)]) /.test(line)).length;

export function lint(path, text, kind) {
  const problems = [];
  const say = (msg) => problems.push(`${path}: ${msg}`);
  const lines = outsideFences(text);
  const filled = lines.filter(({ line }) => line.trim() !== '');

  // H1 and header line.
  if (!filled[0] || !/^# \S/.test(filled[0].line)) say('the first line must be the H1');
  if (lines.filter(({ line }) => /^# /.test(line)).length > 1) say('only one H1 is allowed');
  const header = filled[1]?.line.trim() ?? '';
  if (!/^<sub>.*<\/sub>$/.test(header)) {
    say('the line under the H1 must be the <sub> header line');
  } else {
    if (!header.includes(`**${LEVELS[kind.level]}**`)) say(`the header line must name the level as **${LEVELS[kind.level]}**`);
    if (kind.elective) {
      if (!/Дополнительный урок/.test(header)) say('an Elective\'s header line must say "Дополнительный урок"');
    } else {
      const pos = header.match(/Урок (\d+) из (\d+)/);
      if (!pos) say('the header line must give the position as "Урок N из M"');
      else if (Number(pos[1]) !== kind.number) say(`the header line says Lesson ${pos[1]}, but the file is lesson ${kind.number}`);
    }
    if (!/около \d+ минут/.test(header)) say('the header line must give the time as "около N минут"');
    if (!/Нужно:/.test(header)) say('the header line must list "Нужно:"');
    if (!/Проверено на/.test(header)) say('the header line must end with the Stamp');
  }

  // Slots.
  const h2 = lines.filter(({ line }) => /^## /.test(line)).map(({ n, line }) => ({ n, name: line.slice(3).trim() }));
  const names = h2.map((h) => h.name);
  const expected = [...FIXED, ...OPTIONAL.filter((o) => names.includes(o))];
  for (const slot of FIXED) if (!names.includes(slot)) say(`missing the "${slot}" slot`);
  for (const name of names) if (!FIXED.includes(name) && !OPTIONAL.includes(name)) say(`"## ${name}" is not a lesson slot; use the fixed slot headings`);
  const known = names.filter((n) => expected.includes(n));
  if (known.join('|') !== expected.filter((n) => names.includes(n)).join('|') || new Set(names).size !== names.length) {
    say(`slots must appear once each, in this order: ${expected.join(', ')}`);
  }

  const lastBreak = [...lines].reverse().find(({ line }) => /^-{3,}\s*$/.test(line));
  const section = (name) => {
    const at = h2.findIndex((h) => h.name === name);
    if (at === -1) return null;
    const end = h2[at + 1]?.n ?? lastBreak?.n ?? Infinity;
    return lines.filter(({ n }) => n > h2[at].n && n < end);
  };
  for (const name of OPTIONAL) {
    const body = section(name);
    if (body && listItems(body) > 3) say(`"${name}" has ${listItems(body)} items; at most 3`);
  }

  // Check slot: task list, then the npm run check line, then "if not" diagnoses.
  const check = section('Проверка');
  if (check) {
    const tasks = check.filter(({ line }) => /^- \[[ xX]\] /.test(line));
    const selfChecks = tasks.filter(({ line }) => /самопроверка/i.test(line));
    const runs = check.filter(({ line }) => /npm run check --/.test(line));
    if (tasks.length === 0) say('the Check slot must start with a task list (- [ ] items)');
    if (selfChecks.length > 1) say('the Check slot allows one self-check item at most');
    if (kind.elective) {
      if (runs.length) say('an Elective has no npm run check line');
    } else if (runs.length === 0) {
      say(`the Check slot must give the npm run check -- ${kind.id} line`);
    } else {
      if (tasks.length && runs[0].n < tasks[tasks.length - 1].n) say('the npm run check line must come after the task list');
      const ids = [...runs[0].line.matchAll(/npm run check -- ([a-z]-\d+)/g)].map((m) => m[1]);
      if (!ids.includes(kind.id)) say(`the npm run check line must name ${kind.id}`);
      const after = check.filter(({ n }) => n > runs[0].n).map(({ line }) => line).join(' ');
      const diagnoses = (after.match(/(^|[.!?]\s+)Если /g) ?? []).length;
      const tested = tasks.length - selfChecks.length;
      if (diagnoses > tested) say(`the Check slot has ${diagnoses} "if not" diagnoses for ${tested} tested items; one per item at most`);
    }
  }

  // Footer.
  if (!lastBreak) {
    say('missing the footer after a --- line');
  } else {
    const footer = lines.filter(({ n }) => n > lastBreak.n).map(({ line }) => line);
    const at = (re) => footer.findIndex((l) => re.test(l));
    const sources = at(/Источники:/);
    const index = at(/\[[Оо]главлени[^\]]*\]/);
    const stuck = at(/\[Застряли на уроке\?\]\(([^)]*)\)/);
    const topics = footer.join(' ').match(/Тема: \[/g) ?? [];
    if (sources === -1) say('the footer must start with a Sources: line');
    if (index === -1) say('the footer must link the level index');
    if (!kind.elective && !/[←→]/.test(footer.join(' '))) say('the footer must link the previous or next lesson');
    if (topics.length !== 1) say(`the footer must hold one Topic: link (found ${topics.length})`);
    if (stuck === -1) {
      say('the footer must end with the "Stuck on this lesson?" link');
    } else {
      const url = footer[stuck].match(/\[Застряли на уроке\?\]\(([^)]*)\)/)[1];
      if (!url.includes('template=lesson-feedback.yml')) say('"Stuck on this lesson?" must open the lesson-feedback form');
      if (!kind.elective && !url.includes(`lesson=${kind.id}`)) say(`"Stuck on this lesson?" must prefill lesson=${kind.id}`);
    }
    if (sources !== -1 && index !== -1 && sources > index) say('the Sources: line must come before the navigation');
  }
  return problems;
}

export function run(ctx) {
  const pages = ctx.files.map((f) => [f, lessonKind(f)]).filter(([, k]) => k);
  const problems = pages.flatMap(([page, kind]) => lint(page, readText(ctx.root, page), kind));
  if (problems.length) return { status: 'fail', problems };
  return { status: 'pass', summary: `${pages.length} lessons and Electives` };
}
