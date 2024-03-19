import svgwrite
dwg = svgwrite.Drawing('example.svg', profile='tiny')
dwg.add(dwg.rect((10, 10), (100, 100), fill='red'))
dwg.add(dwg.circle(center=(60, 60), r=30, fill='blue'))
dwg.save()
