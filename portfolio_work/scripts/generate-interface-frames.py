from pathlib import Path
out=Path(__file__).resolve().parents[1] / 'public/frames/interface'
out.mkdir(parents=True, exist_ok=True)
# Deterministic, original vector frames: a wireframe assembles into an interface.
FRAME_COUNT = 113
for i in range(FRAME_COUNT):
 p=i/(FRAME_COUNT-1)
 def phase(start,end): return max(0,min(1,(p-start)/(end-start)))
 shell=phase(0,.3); layout=phase(.2,.6); detail=phase(.5,.92)
 lift=(1-shell)*55
 parts=[f'<svg xmlns="http://www.w3.org/2000/svg" width="960" height="600" viewBox="0 0 960 600"><rect width="960" height="600" fill="#f4f1e8"/><defs><pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#171714" stroke-opacity=".07"/></pattern></defs><rect width="960" height="600" fill="url(#grid)"/>']
 parts += ['<g fill="none" stroke="#171714" stroke-width="1"><path d="M40 60h20m-10-10v20M900 60h20m-10-10v20M40 540h20m-10-10v20M900 540h20m-10-10v20"/></g>']
 parts += [f'<g transform="translate(0 {lift:.2f})"><rect x="120" y="75" width="720" height="430" fill="#f9f6ee" stroke="#171714" stroke-width="2"/><rect x="120" y="75" width="720" height="40" fill="#dfff00" fill-opacity="{shell:.3f}" stroke="#171714"/><g fill="#171714"><circle cx="142" cy="95" r="3"/><circle cx="156" cy="95" r="3"/><circle cx="170" cy="95" r="3"/></g><text x="200" y="100" font-family="monospace" font-size="11" fill="#171714">DENUSHA / DIGITAL STUDIO</text>']
 parts += [f'<g opacity="{layout:.3f}" transform="translate({(1-layout)*-25:.2f} 0)"><rect x="120" y="115" width="110" height="390" fill="#eae7dd" stroke="#171714"/><rect x="137" y="137" width="76" height="32" fill="#171714"/><text x="150" y="158" fill="#dfff00" font-size="14" font-family="monospace">D ↗</text>']
 for j,t in enumerate(['INDEX','ABOUT','WORK','CONTACT']):
  y=205+j*42
  parts += [f'<rect x="137" y="{y-17}" width="76" height="28" fill="{ "#dfff00" if j==2 else "none"}"/><text x="145" y="{y}" font-family="monospace" font-size="10" fill="#171714">{t}</text>']
 parts += ['</g>']
 parts += [f'<g transform="translate(0 {(1-layout)*28:.2f})"><text x="265" y="156" font-family="monospace" font-size="10" fill="#494940">01 / FROM AN IDEA TO AN INTERFACE</text><text x="261" y="223" font-family="Arial,sans-serif" font-size="55" font-weight="800" fill="#171714">MAKE IT</text><text x="261" y="282" font-family="Arial,sans-serif" font-size="55" font-weight="800" fill="none" stroke="#171714" stroke-width="1">MEAN SOMETHING.</text><path d="M265 310H800" stroke="#171714" stroke-dasharray="{0 if p>.5 else 6}"/></g>']
 for j in range(3):
  t=phase(.42+j*.1,.7+j*.1); x=265+j*183; y=340+(1-t)*35
  parts += [f'<g opacity="{t:.3f}"><rect x="{x}" y="{y:.2f}" width="167" height="120" fill="{ "#dfff00" if j==1 else "#eae7dd"}" stroke="#171714"/><text x="{x+13}" y="{y+26:.2f}" font-family="monospace" font-size="11" fill="#171714">0{j+1} / { ["THINK","BUILD","REFINE"][j]}</text><path d="M{x+13} {y+45:.2f}h140m-140 17h{80+int(detail*40)}m-{80+int(detail*40)} 17h95" stroke="#171714" opacity=".5"/></g>']
 parts += [f'<g opacity="{detail:.3f}"><rect x="687" y="133" width="113" height="26" fill="#171714"/><text x="699" y="150" fill="#dfff00" font-family="monospace" font-size="10">IDEA → BUILT</text></g></g>']
 parts += [f'<text x="120" y="560" font-family="monospace" font-size="11" fill="#494940">DESIGN STUDY / {i+1:02d}</text><text x="840" y="560" text-anchor="end" font-family="monospace" font-size="11" fill="#494940">WIREFRAME → INTERFACE</text></svg>']
 (out/f'{i:03d}.svg').write_text(''.join(parts))
print(f'Generated {FRAME_COUNT} SVG sequence frames.')
