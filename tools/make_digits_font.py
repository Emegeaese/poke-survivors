"""Genera assets/fonts/PixelDigits.ttf: los dígitos 0-9 en pixel art (cuadrícula 5x7).

En Pixelify Sans el 5 se parece a una S y el 2 se confunde, así que los números
del juego usan esta fuente (css/style.css, @font-face con unicode-range).
Sin dependencias: escribe el TrueType a mano.

    python tools/make_digits_font.py
"""
import struct, os

U = 112                 # un píxel de la cuadrícula = 112 unidades (UPM 1000)
W, H = 5, 7
ADV = 700               # ancho de avance
LSB = 70                 # margen izquierdo
UPM, ASC, DESC = 1000, 800, -200
BOLD = 6                 # los trazos se engordan un poco (unidades) para que se vean firmes

DIGITS = {
    '0': ['.###.', '#...#', '#..##', '#.#.#', '##..#', '#...#', '.###.'],
    '1': ['..#..', '.##..', '..#..', '..#..', '..#..', '..#..', '.###.'],
    '2': ['.###.', '#...#', '....#', '...#.', '..#..', '.#...', '#####'],
    '3': ['####.', '....#', '....#', '.###.', '....#', '....#', '####.'],
    '4': ['...#.', '..##.', '.#.#.', '#..#.', '#####', '...#.', '...#.'],
    '5': ['#####', '#....', '####.', '....#', '....#', '#...#', '.###.'],
    '6': ['..##.', '.#...', '#....', '####.', '#...#', '#...#', '.###.'],
    '7': ['#####', '....#', '...#.', '..#..', '.#...', '.#...', '.#...'],
    '8': ['.###.', '#...#', '#...#', '.###.', '#...#', '#...#', '.###.'],
    '9': ['.###.', '#...#', '#...#', '.####', '....#', '...#.', '.##..'],
}
ORDER = '0123456789'


def glyph(rows):
    """Contornos: un rectángulo por tramo horizontal de píxeles (sentido horario)."""
    rects = []
    for r, row in enumerate(rows):
        y1 = (H - r) * U            # arriba de la fila
        y0 = y1 - U
        c = 0
        while c < W:
            if row[c] == '#':
                s = c
                while c < W and row[c] == '#':
                    c += 1
                rects.append((LSB + s * U, y0 - BOLD, LSB + c * U, y1 + BOLD))
            else:
                c += 1
    return rects


def glyph_bytes(rects):
    if not rects:
        return b'', (0, 0, 0, 0), 0, 0
    xs, ys, ends, n = [], [], [], 0
    for (x0, y0, x1, y1) in rects:
        xs += [x0, x0, x1, x1]
        ys += [y0, y1, y1, y0]
        n += 4
        ends.append(n - 1)
    bb = (min(xs), min(ys), max(xs), max(ys))
    out = struct.pack('>hhhhh', len(rects), *bb)
    out += b''.join(struct.pack('>H', e) for e in ends)
    out += struct.pack('>H', 0)                       # sin instrucciones
    out += b'\x01' * n                                # todos los puntos en la curva, deltas de 16 bits
    px = 0
    for x in xs:
        out += struct.pack('>h', x - px); px = x
    py = 0
    for y in ys:
        out += struct.pack('>h', y - py); py = y
    out += b'\x00' * (-len(out) % 4)
    return out, bb, n, len(rects)


def checksum(b):
    b = b + b'\x00' * (-len(b) % 4)
    return sum(struct.unpack('>%dI' % (len(b) // 4), b)) & 0xFFFFFFFF


def build():
    glyphs = [b'']                                    # .notdef vacío
    boxes = [(0, 0, 0, 0)]
    maxp_pts = maxp_con = 0
    for ch in ORDER:
        data, bb, n, c = glyph_bytes(glyph(DIGITS[ch]))
        glyphs.append(data); boxes.append(bb)
        maxp_pts = max(maxp_pts, n); maxp_con = max(maxp_con, c)
    ng = len(glyphs)

    glyf = b''.join(glyphs)
    loca, off = b'', 0
    for g in glyphs:
        loca += struct.pack('>I', off); off += len(g)
    loca += struct.pack('>I', off)
    hmtx = struct.pack('>Hh', ADV // 2, 0) + b''.join(struct.pack('>Hh', ADV, LSB) for _ in ORDER)

    xmin = min(b[0] for b in boxes[1:]); ymin = min(b[1] for b in boxes[1:])
    xmax = max(b[2] for b in boxes[1:]); ymax = max(b[3] for b in boxes[1:])
    head = struct.pack('>IIIIHHqqhhhhHHhhh', 0x00010000, 0x00010000, 0, 0x5F0F3CF5, 0x000B, UPM,
                       0, 0, xmin, ymin, xmax, ymax, 0, 8, 2, 1, 0)
    hhea = struct.pack('>IhhhHhhhhhhhhhhhH', 0x00010000, ASC, DESC, 0, ADV, LSB, ADV - (LSB + W * U), xmax,
                       1, 0, 0, 0, 0, 0, 0, 0, ng)
    maxp = struct.pack('>IHHHHHHHHHHHHHH', 0x00010000, ng, maxp_pts, maxp_con, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0)
    os2 = (struct.pack('>HhHHH', 3, ADV, 400, 5, 0)
           + struct.pack('>hhhhhhhh', 650, 600, 0, 75, 650, 600, 0, 350)   # subíndice, superíndice
           + struct.pack('>hh', 50, 250)                                   # tachado
           + struct.pack('>h', 0)                                          # familia
           + bytes([2, 0, 5, 3, 0, 0, 0, 0, 0, 0])                         # panose
           + struct.pack('>IIII', 1, 0, 0, 0)                              # rangos Unicode
           + b'PXDG'
           + struct.pack('>HHH', 0x0040, 0x0030, 0x0039)                   # regular, primer y último carácter
           + struct.pack('>hhh', ASC, DESC, 0)
           + struct.pack('>HH', ASC, -DESC)
           + struct.pack('>II', 1, 0)
           + struct.pack('>hhHHH', 500, 700, 0, 0, 1))

    # cmap: formato 4, U+0030..U+0039 -> glifos 1..10
    seg = [(0x30, 0x39, (1 - 0x30) & 0xFFFF), (0xFFFF, 0xFFFF, 1)]
    sc = len(seg)
    sub = struct.pack('>HHHHHHH', 4, 16 + 8 * sc, 0, sc * 2, 4, 1, 0)
    sub += b''.join(struct.pack('>H', s[1]) for s in seg) + struct.pack('>H', 0)
    sub += b''.join(struct.pack('>H', s[0]) for s in seg)
    sub += b''.join(struct.pack('>H', s[2]) for s in seg)
    sub += b''.join(struct.pack('>H', 0) for _ in seg)
    cmap = struct.pack('>HH', 0, 1) + struct.pack('>HHI', 3, 1, 12) + sub

    names = {1: 'Pixel Digits', 2: 'Regular', 4: 'Pixel Digits', 6: 'PixelDigits-Regular'}
    recs, strs, so = b'', b'', 0
    for nid in sorted(names):
        s = names[nid].encode('utf-16-be')
        recs += struct.pack('>HHHHHH', 3, 1, 0x409, nid, len(s), so)
        strs += s; so += len(s)
    name = struct.pack('>HHH', 0, len(names), 6 + 12 * len(names)) + recs + strs
    post = struct.pack('>IIhhIIIII', 0x00030000, 0, -100, 50, 0, 0, 0, 0, 0)

    tables = {'OS/2': os2, 'cmap': cmap, 'glyf': glyf, 'head': head, 'hhea': hhea, 'hmtx': hmtx,
              'loca': loca, 'maxp': maxp, 'name': name, 'post': post}
    tags = sorted(tables)
    n = len(tags)
    pw = 1
    while pw * 2 <= n:
        pw *= 2
    sfnt = struct.pack('>IHHHH', 0x00010000, n, pw * 16, pw.bit_length() - 1, n * 16 - pw * 16)
    offset = 12 + 16 * n
    directory, body = b'', b''
    head_pos = None
    for t in tags:
        data = tables[t]
        if t == 'head':
            head_pos = offset + len(body)
        directory += struct.pack('>4sIII', t.encode(), checksum(data), offset + len(body), len(data))
        body += data + b'\x00' * (-len(data) % 4)
    font = bytearray(sfnt + directory + body)
    adj = (0xB1B0AFBA - checksum(bytes(font))) & 0xFFFFFFFF
    font[head_pos + 8:head_pos + 12] = struct.pack('>I', adj)
    return bytes(font)


if __name__ == '__main__':
    out = os.path.join(os.path.dirname(__file__), '..', 'assets', 'fonts', 'PixelDigits.ttf')
    data = build()
    with open(out, 'wb') as f:
        f.write(data)
    print('ok', len(data), 'bytes ->', os.path.normpath(out))
