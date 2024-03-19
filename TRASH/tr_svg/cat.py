import svgwrite

def draw_cat():
    dwg = svgwrite.Drawing('cat.svg', profile='tiny')

    # Тело котика
    dwg.add(dwg.circle(center=(100, 100), r=50, fill='orange', stroke='black', stroke_width=2))

    # Глаза
    dwg.add(dwg.circle(center=(80, 80), r=7, fill='white'))
    dwg.add(dwg.circle(center=(120, 80), r=7, fill='white'))
    dwg.add(dwg.circle(center=(80, 80), r=3, fill='black'))
    dwg.add(dwg.circle(center=(120, 80), r=3, fill='black'))

    # Нос
    dwg.add(dwg.polygon(points=[(100, 90), (95, 100), (105, 100)], fill='black'))

    # Уши
    dwg.add(dwg.polygon(points=[(70, 65), (60, 50), (75, 40)], fill='orange', stroke='black', stroke_width=2))
    dwg.add(dwg.polygon(points=[(130, 65), (140, 50), (125, 40)], fill='orange', stroke='black', stroke_width=2))

    # Усы
    dwg.add(dwg.line(start=(90, 110), end=(70, 120), stroke='black', stroke_width=2))
    dwg.add(dwg.line(start=(110, 110), end=(130, 120), stroke='black', stroke_width=2))

    # Рот
    dwg.add(dwg.line(start=(90, 120), end=(110, 120), stroke='black', stroke_width=2))

    dwg.save()

if __name__ == "__main__":
    draw_cat()
