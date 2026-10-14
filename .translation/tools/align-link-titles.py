"""Где в оригинале текст ссылки на страницу руководства совпадал с её H1, ставит русский H1 этой страницы.
Ссылки сопоставляются по порядку (переводчики сохраняют число и порядок ссылок).
Usage: python3 .translation/tools/align-link-titles.py <base-rev> <files...>"""
import os, re, subprocess, sys
LINK = re.compile(r'(?<!!)\[((?:[^\[\]]|\[[^\]]*\])*)\]\(([^)\s]+)\)')
def h1(text):
    for line in text.split('\n'):
        if line.startswith('# '):
            t = re.sub(r'<[^>]+>', '', line[2:]).strip()
            return re.sub(r'\s+', ' ', t)
    return None
def show(rev, path):
    try: return subprocess.run(['git', 'show', f'{rev}:{path}'], capture_output=True, text=True, check=True).stdout
    except subprocess.CalledProcessError: return None
base = sys.argv[1]; changed = 0
for f in sys.argv[2:]:
    old = show(base, f); new = open(f).read()
    if old is None: continue
    ol, nl = list(LINK.finditer(old)), list(LINK.finditer(new))
    if len(ol) != len(nl): print(f'SKIP {f}: links {len(ol)} vs {len(nl)}'); continue
    out, pos = [], 0
    for o, n in zip(ol, nl):
        target = n.group(2).split('#')[0]
        if not target or '://' in target or not target.endswith('.md') or o.group(2) != n.group(2): continue
        tpath = os.path.normpath(os.path.join(os.path.dirname(f), target))
        if not os.path.exists(tpath): continue
        en, ru = h1(show(base, tpath) or ''), h1(open(tpath).read())
        if en and ru and o.group(1).strip() == en and n.group(1) != ru:
            out.append(new[pos:n.start(1)] + ru); pos = n.end(1); changed += 1
    out.append(new[pos:]); open(f, 'w').write(''.join(out))
print('changed', changed)
