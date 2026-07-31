import os

import pandas as pd
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

BASE_URL = "https://www.hollys.co.kr/store/korea/korStore2.do"
session = requests.Session()


def get_page_table(page):
    response = session.get(
        BASE_URL,
        params={"pageNo": page},
        timeout=10
    )
    response.raise_for_status()

    soup = BeautifulSoup(response.text, "html.parser")
    return soup.find("table")


def get_headers(table):
    header_row = table.find("tr")

    if header_row is None:
        return []

    return [
        th.get_text(" ", strip=True)
        for th in header_row.find_all("th")
    ]


def get_store_rows(table, column_count):
    page_rows = []

    for tr in table.find_all("tr"):
        tds = tr.find_all("td")

        if not tds:
            continue

        row = [
            td.get_text(" ", strip=True)
            for td in tds
        ]

        # "등록된 매장이 없습니다" 같은 colspan 안내 행 제외
        if len(row) != column_count:
            continue

        if any(row):
            page_rows.append(row)

    return page_rows


# 1단계: 마지막 페이지 찾기
first_table = get_page_table(1)

if first_table is None:
    raise RuntimeError("매장 테이블을 찾을 수 없습니다.")

headers = get_headers(first_table)

if not headers:
    raise RuntimeError("테이블 헤더를 찾을 수 없습니다.")

page = 1

while True:
    table = get_page_table(page)

    if table is None:
        last_page = page - 1
        break

    page_rows = get_store_rows(
        table,
        len(headers)
    )

    if not page_rows:
        last_page = page - 1
        break

    page += 1

print(f"마지막 페이지: {last_page}")


# 2단계: tqdm으로 전체 데이터 수집
rows = []

for page in tqdm(
    range(1, last_page + 1),
    desc="할리스 매장 크롤링",
    unit="page"
):
    table = get_page_table(page)

    if table is None:
        continue

    page_rows = get_store_rows(
        table,
        len(headers)
    )

    rows.extend(page_rows)


df = pd.DataFrame(
    rows,
    columns=headers
)

if "매장 서비스" in df.columns:
    df.drop(
        columns=["매장 서비스"],
        inplace=True
    )

os.makedirs("./data", exist_ok=True)

df.to_csv(
    "./data/hollys_data.csv",
    index=False,
    encoding="utf-8-sig"
)

print(df.head())
print(f"전체 수집 완료: {len(df)}개")