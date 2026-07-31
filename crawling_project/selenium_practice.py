import os
import time

import pandas as pd
from bs4 import BeautifulSoup
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.by import By
from tqdm import tqdm

from chrome_driver import chrome_driver

BASE_URL = "https://www.hollys.co.kr/store/korea/korStore2.do"
PAGING_XPATH = '//*[@id="contents"]/div[2]/fieldset/fieldset/div[2]'

driver = chrome_driver()


def get_page_table():
    soup = BeautifulSoup(
        driver.page_source,
        "html.parser"
    )

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

        if len(row) != column_count:
            continue

        if any(row):
            page_rows.append(row)

    return page_rows


def click_element(element):
    driver.execute_script(
        "arguments[0].click();",
        element
    )


def move_to_next_page(current_page):
    next_page = current_page + 1

    try:
        page_link = driver.find_element(
            By.XPATH,
            f'{PAGING_XPATH}//a[normalize-space()="{next_page}"]'
        )

        click_element(page_link)
        time.sleep(1)

        return True

    except NoSuchElementException:
        pass

    try:
        next_button = driver.find_element(
            By.XPATH,
            f'{PAGING_XPATH}//img[contains(@alt, "다음")]/parent::a'
        )

        click_element(next_button)
        time.sleep(1)

        return True

    except NoSuchElementException:
        return False


try:
    driver.get(BASE_URL)
    time.sleep(1)

    first_table = get_page_table()

    if first_table is None:
        raise RuntimeError(
            "매장 테이블을 찾을 수 없습니다."
        )

    headers = get_headers(first_table)

    if not headers:
        raise RuntimeError(
            "테이블 헤더를 찾을 수 없습니다."
        )

    rows = []
    page = 1

    with tqdm(
        desc="할리스 매장 크롤링",
        unit="page"
    ) as progress:
        while True:
            table = get_page_table()

            if table is None:
                break

            page_rows = get_store_rows(
                table,
                len(headers)
            )

            if not page_rows:
                break

            rows.extend(page_rows)

            tqdm.write(
                f"{page}페이지 수집 완료 "
            )

            progress.set_postfix(
                current_page=page,
                stores=len(rows)
            )
            progress.update(1)

            if not move_to_next_page(page):
                break

            page += 1

    df = pd.DataFrame(
        rows,
        columns=headers
    )

    if "매장 서비스" in df.columns:
        df.drop(
            columns=["매장 서비스"],
            inplace=True
        )

    os.makedirs(
        "./data",
        exist_ok=True
    )

    df.to_csv(
        "./data/hollys_data.csv",
        index=False,
        encoding="utf-8-sig"
    )

    print(df.head())
    print(f"마지막 페이지: {page}")
    print(f"전체 수집 완료: {len(df)}개")

finally:
    driver.quit()