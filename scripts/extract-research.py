"""Extract supplied ODT text and hyperlinks without third-party dependencies."""
from pathlib import Path
from zipfile import ZipFile
import xml.etree.ElementTree as ET

TEXT = '{urn:oasis:names:tc:opendocument:xmlns:text:1.0}'
HREF = '{http://www.w3.org/1999/xlink}href'
for document in sorted(Path('research').glob('*.odt')):
    print(f'\n--- {document.name} ---')
    with ZipFile(document) as archive:
        root = ET.fromstring(archive.read('content.xml'))
    for element in root.iter():
        if element.tag in (TEXT + 'p', TEXT + 'h'):
            print(''.join(element.itertext()))
            for child in element.iter():
                if child.get(HREF):
                    print('Source:', child.get(HREF))
