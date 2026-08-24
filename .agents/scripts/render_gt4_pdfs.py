import fitz, os, json
files = [
 'attached_assets/D-MAX-GT4-SELL-SHEET-US-version-V1.1-250430_1787582393483.pdf',
 'attached_assets/D-Max-Series-Brochure-web_1787582393484.pdf',
]
out = '.agents/outputs'
os.makedirs('.agents/outputs/gt4-pdf-renders', exist_ok=True)
summary=[]
for path in files:
    doc=fitz.open(path)
    name=os.path.splitext(os.path.basename(path))[0]
    summary.append({'file':path,'pages':doc.page_count,'metadata':doc.metadata})
    for i in range(min(doc.page_count, 3)):
        pix=doc[i].get_pixmap(matrix=fitz.Matrix(1.5,1.5), alpha=False)
        dest=f'.agents/outputs/gt4-pdf-renders/{name}-page-{i+1}.png'
        pix.save(dest)
print(json.dumps(summary, indent=2))
