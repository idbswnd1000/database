import time
from getpass import getpass
from urllib.parse import urljoin

import pandas as pd
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait


LOGIN_URL = "https://iit.kw.ac.kr/"

BOARD_URL = (
    "https://iit.kw.ac.kr/"
    "servlet/controller.home.bbs.NoticeUserServlet"
    "?p_process=listPage&p_layerId=5&p_page=1"
)

MAX_PAGE = 10

USER_ID = "2025018014"
USER_PASSWORD = "powq0921!!A"


def create_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    options.add_argument("--disable-notifications")

    driver = webdriver.Chrome(options=options)
    driver.implicitly_wait(3)

    return driver


def login(driver):
    driver.get(LOGIN_URL)

    wait = WebDriverWait(driver, 15)

    print("1. 홈페이지 접속 완료")

    # 상단 로그인 버튼을 눌러 로그인 창 열기
    open_login_button = wait.until(
        EC.element_to_be_clickable(
            (By.CSS_SELECTOR, "a.btn-login")
        )
    )

    driver.execute_script(
        "arguments[0].click();",
        open_login_button
    )

    print("2. 로그인 창 열기 완료")

    # 아이디 입력창
    user_input = wait.until(
        EC.visibility_of_element_located(
            (By.ID, "LoginID")
        )
    )

    # 비밀번호 입력창
    password_input = wait.until(
        EC.visibility_of_element_located(
            (By.ID, "LoginPW")
        )
    )

    user_input.clear()
    user_input.send_keys(USER_ID)

    password_input.clear()
    password_input.send_keys(USER_PASSWORD)

    print("3. 아이디와 비밀번호 입력 완료")

    # 실제 로그인 실행 버튼
    login_button = wait.until(
        EC.element_to_be_clickable(
            (By.CSS_SELECTOR, "button.btn-login02")
        )
    )

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        login_button
    )

    # onclick="goLogin('web');" 직접 실행
    driver.execute_script("goLogin('web');")

    print("4. 로그인 함수 실행 완료")

    # 경고창 확인
    try:
        alert = WebDriverWait(driver, 3).until(
            EC.alert_is_present()
        )

        alert_message = alert.text
        alert.accept()

        raise RuntimeError(
            f"로그인 실패 알림: {alert_message}"
        )

    except TimeoutException:
        pass

    # 로그인 처리 대기
    time.sleep(3)

    print("현재 주소:", driver.current_url)

    # 로그인 입력창이 계속 보이는지 확인
    visible_login_fields = driver.find_elements(
        By.CSS_SELECTOR,
        "#LoginID:visible"
    )

    print("5. 로그인 처리 완료")


def wait_for_board(driver):
    wait = WebDriverWait(driver, 15)

    wait.until(
        EC.presence_of_element_located(
            (By.CSS_SELECTOR, "table")
        )
    )


def collect_current_page(driver, page):
    wait_for_board(driver)

    soup = BeautifulSoup(
        driver.page_source,
        "html.parser"
    )

    result = []

    rows = soup.select("table tbody tr")

    for row in rows:
        columns = row.select("td")

        if len(columns) < 3:
            continue

        link_tag = row.select_one("a")

        title = ""
        link = ""

        if link_tag:
            title = link_tag.get_text(
                " ",
                strip=True
            )

            href = link_tag.get(
                "href",
                ""
            )

            if href and not href.startswith(
                "javascript:"
            ):
                link = urljoin(
                    driver.current_url,
                    href
                )

        number = columns[0].get_text(
            " ",
            strip=True
        )

        date = columns[-1].get_text(
            " ",
            strip=True
        )

        # 제목이 없는 행은 제외
        if not title:
            continue

        result.append({
            "페이지": page,
            "번호": number,
            "제목": title,
            "작성일": date,
            "링크": link,
        })

    return result


def find_page_button(driver, target_page):
    wait = WebDriverWait(driver, 10)

    selectors = [
        (
            By.XPATH,
            f'//a[contains(@href, "p_page={target_page}")]'
        ),
        (
            By.XPATH,
            f'//a[normalize-space()="{target_page}" '
            f'and contains(@href, "NoticeUserServlet")]'
        ),
        (
            By.XPATH,
            f'//a[normalize-space()="{target_page}"]'
        ),
    ]

    for selector in selectors:
        try:
            return wait.until(
                EC.element_to_be_clickable(
                    selector
                )
            )
        except TimeoutException:
            continue

    raise TimeoutException(
        f"{target_page}페이지 버튼을 찾지 못했습니다."
    )


def click_page_button(driver, target_page):
    wait = WebDriverWait(driver, 15)

    old_url = driver.current_url
    old_table = wait.until(
        EC.presence_of_element_located(
            (By.CSS_SELECTOR, "table")
        )
    )

    page_button = find_page_button(
        driver,
        target_page
    )

    driver.execute_script(
        """
        arguments[0].scrollIntoView({
            block: 'center'
        });
        """,
        page_button
    )

    time.sleep(0.5)

    try:
        page_button.click()
    except Exception:
        driver.execute_script(
            "arguments[0].click();",
            page_button
        )

    try:
        wait.until(
            lambda d:
            f"p_page={target_page}" in d.current_url
            or d.current_url != old_url
        )
    except TimeoutException:
        try:
            wait.until(
                EC.staleness_of(old_table)
            )
        except TimeoutException:
            pass

    wait_for_board(driver)
    time.sleep(1)


def save_csv(rows):
    if not rows:
        print("수집된 데이터가 없습니다.")
        return

    df = pd.DataFrame(rows)

    df.drop_duplicates(
        subset=["제목", "링크"],
        inplace=True
    )

    filename = "iit_notice_10pages.csv"

    df.to_csv(
        filename,
        index=False,
        encoding="utf-8-sig"
    )

    print(
        f"저장 완료: {filename}"
    )

    print(
        f"총 {len(df)}개 게시글 저장"
    )


def main():
    driver = create_driver()

    try:
        login(driver)

        driver.get(BOARD_URL)
        wait_for_board(driver)

        all_rows = []

        for page in range(
            1,
            MAX_PAGE + 1
        ):
            print(
                f"\n{page}페이지 수집 중"
            )

            page_rows = collect_current_page(
                driver,
                page
            )

            all_rows.extend(page_rows)

            print(
                f"{page}페이지 수집 완료"
            )

            print(
                f"이번 페이지: {len(page_rows)}개"
            )

            print(
                f"누적: {len(all_rows)}개"
            )

            if page == MAX_PAGE:
                break

            try:
                click_page_button(
                    driver,
                    page + 1
                )

            except Exception as error:
                print(
                    f"{page + 1}페이지 이동 실패"
                )

                print(error)
                break

        save_csv(all_rows)

    except Exception as error:
        print(
            "실행 중 오류가 발생했습니다."
        )

        print(error)

        input(
            "브라우저를 확인한 후 "
            "Enter를 누르면 종료합니다: "
        )

    finally:
        driver.quit()


if __name__ == "__main__":
    main()