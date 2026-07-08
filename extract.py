import zipfile, xml.etree.ElementTree as ET, sys
try:
    z = zipfile.ZipFile(r'c:\Users\Administrator\OneDrive\Desktop\Interns_project\Req.doc\Requirements_Document.docx')
    xml_content = z.read('word/document.xml')
    root = ET.fromstring(xml_content)
    ns = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    text = '\n'.join(''.join(node.text for node in p.findall('.//w:t', ns) if node.text) for p in root.findall('.//w:p', ns))
    with open('extracted_reqs.txt', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Success")
except Exception as e:
    print(f"Error: {e}")
