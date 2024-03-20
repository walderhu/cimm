import requests
from bs4 import BeautifulSoup
import pandas as pd

url = 'https://jut-su.best/top.html'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'lxml')

sect_content = soup.find('div', class_='sect__content d-grid')
films = soup.find('div', class_='sect__content d-grid').findAll('a', class_='poster grid-item d-flex fd-column has-overlay')

data = []
for local_poster in films:
    name = local_poster.find('h3', class_='poster__title ws-nowrap').text
    link = local_poster.get('href')
    description = local_poster.find('div', class_='poster__text line-clamp').text
    episodes = local_poster.find('div', class_='poster__label').text
    genre = local_poster.findAll('li')[1].text
    data.append([name, link, description, episodes, genre])

header = ['name', 'link', 'description', 'episodes', 'genre']
df = pd.DataFrame(data, columns=header)
df.to_excel('./output.xlsx')
