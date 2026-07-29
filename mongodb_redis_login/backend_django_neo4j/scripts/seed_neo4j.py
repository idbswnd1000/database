import os
import sys
from pathlib import Path

import pandas as pd
from dotenv import load_dotenv
from neo4j import GraphDatabase


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

DETAILS_PATH = DATA_DIR / "Details.xlsx"
SALES_PATH = DATA_DIR / "Sales.xlsx"

sys.path.append(str(BASE_DIR))

load_dotenv(BASE_DIR / ".env")

NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "1234")
NEO4J_DATABASE = os.getenv("NEO4J_DATABASE", "neo4j")

BATCH_SIZE = 500


def clean_value(value):
    if pd.isna(value):
        return None

    if isinstance(value, pd.Timestamp):
        return value.strftime("%Y-%m-%d")

    if hasattr(value, "item"):
        return value.item()

    return value


def clean_records(dataframe):
    records = []

    for row in dataframe.to_dict("records"):
        cleaned = {
            str(key).strip(): clean_value(value)
            for key, value in row.items()
        }
        records.append(cleaned)

    return records


def find_column(dataframe, candidates, required=True):
    normalized = {
        str(column).strip().replace(" ", ""): column
        for column in dataframe.columns
    }

    for candidate in candidates:
        key = candidate.strip().replace(" ", "")

        if key in normalized:
            return normalized[key]

    if required:
        raise KeyError(
            f"필요한 컬럼을 찾을 수 없습니다.\n"
            f"찾는 컬럼 후보: {candidates}\n"
            f"실제 컬럼: {list(dataframe.columns)}"
        )

    return None


def rename_columns(dataframe, mapping):
    result = dataframe.copy()
    rename_map = {}

    for new_name, candidates in mapping.items():
        old_name = find_column(
            result,
            candidates,
            required=False,
        )

        if old_name is not None:
            rename_map[old_name] = new_name

    return result.rename(columns=rename_map)


def run_batch(session, query, rows):
    for start in range(0, len(rows), BATCH_SIZE):
        batch = rows[start:start + BATCH_SIZE]
        session.run(query, rows=batch).consume()

        end = min(start + BATCH_SIZE, len(rows))
        print(f"  {end}/{len(rows)} 처리 완료")


def create_constraints(session):
    queries = [
        """
        CREATE CONSTRAINT category_code_unique IF NOT EXISTS
        FOR (n:Category)
        REQUIRE n.categoryCode IS UNIQUE
        """,
        """
        CREATE CONSTRAINT product_category_code_unique IF NOT EXISTS
        FOR (n:ProductCategory)
        REQUIRE n.productCategoryCode IS UNIQUE
        """,
        """
        CREATE CONSTRAINT product_code_unique IF NOT EXISTS
        FOR (n:Product)
        REQUIRE n.productCode IS UNIQUE
        """,
        """
        CREATE CONSTRAINT region_code_unique IF NOT EXISTS
        FOR (n:Region)
        REQUIRE n.regionCode IS UNIQUE
        """,
        """
        CREATE CONSTRAINT customer_code_unique IF NOT EXISTS
        FOR (n:Customer)
        REQUIRE n.customerCode IS UNIQUE
        """,
        """
        CREATE CONSTRAINT promotion_code_unique IF NOT EXISTS
        FOR (n:Promotion)
        REQUIRE n.promotionCode IS UNIQUE
        """,
        """
        CREATE CONSTRAINT channel_code_unique IF NOT EXISTS
        FOR (n:Channel)
        REQUIRE n.channelCode IS UNIQUE
        """,
        """
        CREATE CONSTRAINT date_value_unique IF NOT EXISTS
        FOR (n:Date)
        REQUIRE n.date IS UNIQUE
        """,
        """
        CREATE CONSTRAINT sale_id_unique IF NOT EXISTS
        FOR (n:Sale)
        REQUIRE n.saleId IS UNIQUE
        """,
    ]

    for query in queries:
        session.run(query).consume()

    print("제약조건 생성 완료")


def seed_categories(session, dataframe):
    dataframe = rename_columns(
        dataframe,
        {
            "categoryCode": [
                "분류코드",
                "카테고리코드",
                "CategoryCode",
                "Category Code",
            ],
            "categoryName": [
                "분류명",
                "카테고리명",
                "CategoryName",
                "Category Name",
                "분류",
            ],
        },
    )

    required = ["categoryCode", "categoryName"]
    rows = clean_records(dataframe[required].dropna(subset=["categoryCode"]))

    query = """
    UNWIND $rows AS row

    MERGE (c:Category {
        categoryCode: toString(row.categoryCode)
    })

    SET c.categoryName = row.categoryName
    """

    print("Category 적재 시작")
    run_batch(session, query, rows)


def seed_product_categories(session, dataframe):
    dataframe = rename_columns(
        dataframe,
        {
            "productCategoryCode": [
                "제품분류코드",
                "ProductCategoryCode",
                "Product Category Code",
            ],
            "productCategoryName": [
                "제품분류명",
                "ProductCategoryName",
                "Product Category Name",
                "제품분류",
            ],
            "categoryCode": [
                "분류코드",
                "카테고리코드",
                "CategoryCode",
                "Category Code",
            ],
        },
    )

    required = [
        "productCategoryCode",
        "productCategoryName",
        "categoryCode",
    ]

    rows = clean_records(
        dataframe[required].dropna(
            subset=["productCategoryCode"]
        )
    )

    query = """
    UNWIND $rows AS row

    MERGE (pc:ProductCategory {
        productCategoryCode: toString(row.productCategoryCode)
    })

    SET pc.productCategoryName = row.productCategoryName

    WITH pc, row

    MATCH (c:Category {
        categoryCode: toString(row.categoryCode)
    })

    MERGE (pc)-[:BELONGS_TO]->(c)
    """

    print("ProductCategory 적재 시작")
    run_batch(session, query, rows)


def seed_products(session, dataframe):
    dataframe = rename_columns(
        dataframe,
        {
            "productCode": [
                "제품코드",
                "ProductCode",
                "Product Code",
            ],
            "productName": [
                "제품명",
                "ProductName",
                "Product Name",
            ],
            "productCategoryCode": [
                "제품분류코드",
                "ProductCategoryCode",
                "Product Category Code",
            ],
        },
    )

    required = [
        "productCode",
        "productName",
        "productCategoryCode",
    ]

    rows = clean_records(
        dataframe[required].dropna(subset=["productCode"])
    )

    query = """
    UNWIND $rows AS row

    MERGE (p:Product {
        productCode: toString(row.productCode)
    })

    SET p.productName = row.productName

    WITH p, row

    MATCH (pc:ProductCategory {
        productCategoryCode: toString(row.productCategoryCode)
    })

    MERGE (p)-[:BELONGS_TO]->(pc)
    """

    print("Product 적재 시작")
    run_batch(session, query, rows)


def seed_regions(session, dataframe):
    dataframe = rename_columns(
        dataframe,
        {
            "regionCode": [
                "지역코드",
                "RegionCode",
                "Region Code",
            ],
            "regionName": [
                "지역명",
                "RegionName",
                "Region Name",
                "지역",
            ],
        },
    )

    required = ["regionCode", "regionName"]
    rows = clean_records(dataframe[required].dropna(subset=["regionCode"]))

    query = """
    UNWIND $rows AS row

    MERGE (r:Region {
        regionCode: toString(row.regionCode)
    })

    SET r.regionName = row.regionName
    """

    print("Region 적재 시작")
    run_batch(session, query, rows)


def seed_customers(session, dataframe):
    dataframe = rename_columns(
        dataframe,
        {
            "customerCode": [
                "고객코드",
                "CustomerCode",
                "Customer Code",
            ],
            "customerName": [
                "고객명",
                "CustomerName",
                "Customer Name",
            ],
            "regionCode": [
                "지역코드",
                "RegionCode",
                "Region Code",
            ],
        },
    )

    required = [
        "customerCode",
        "customerName",
        "regionCode",
    ]

    rows = clean_records(
        dataframe[required].dropna(subset=["customerCode"])
    )

    query = """
    UNWIND $rows AS row

    MERGE (c:Customer {
        customerCode: toString(row.customerCode)
    })

    SET c.customerName = row.customerName

    WITH c, row

    MATCH (r:Region {
        regionCode: toString(row.regionCode)
    })

    MERGE (c)-[:LIVES_IN]->(r)
    """

    print("Customer 적재 시작")
    run_batch(session, query, rows)


def seed_promotions(session, dataframe):
    dataframe = rename_columns(
        dataframe,
        {
            "promotionCode": [
                "프로모션코드",
                "PromotionCode",
                "Promotion Code",
            ],
            "promotionName": [
                "프로모션명",
                "PromotionName",
                "Promotion Name",
                "프로모션",
            ],
            "discountRate": [
                "할인율",
                "DiscountRate",
                "Discount Rate",
            ],
        },
    )

    columns = ["promotionCode", "promotionName"]

    if "discountRate" in dataframe.columns:
        columns.append("discountRate")

    rows = clean_records(
        dataframe[columns].dropna(subset=["promotionCode"])
    )

    query = """
    UNWIND $rows AS row

    MERGE (p:Promotion {
        promotionCode: toString(row.promotionCode)
    })

    SET p.promotionName = row.promotionName,
        p.discountRate = row.discountRate
    """

    print("Promotion 적재 시작")
    run_batch(session, query, rows)


def seed_channels(session, dataframe):
    dataframe = rename_columns(
        dataframe,
        {
            "channelCode": [
                "채널코드",
                "ChannelCode",
                "Channel Code",
            ],
            "channelName": [
                "채널명",
                "ChannelName",
                "Channel Name",
                "채널",
            ],
        },
    )

    required = ["channelCode", "channelName"]
    rows = clean_records(dataframe[required].dropna(subset=["channelCode"]))

    query = """
    UNWIND $rows AS row

    MERGE (c:Channel {
        channelCode: toString(row.channelCode)
    })

    SET c.channelName = row.channelName
    """

    print("Channel 적재 시작")
    run_batch(session, query, rows)


def seed_dates(session, dataframe):
    dataframe = rename_columns(
        dataframe,
        {
            "date": [
                "날짜",
                "주문일자",
                "판매일자",
                "Date",
            ],
            "year": [
                "년",
                "연도",
                "Year",
            ],
            "month": [
                "월",
                "Month",
            ],
            "day": [
                "일",
                "Day",
            ],
        },
    )

    if "date" not in dataframe.columns:
        raise KeyError(
            f"날짜 컬럼을 찾을 수 없습니다. 실제 컬럼: {list(dataframe.columns)}"
        )

    dataframe["date"] = pd.to_datetime(
        dataframe["date"],
        errors="coerce",
    )

    dataframe = dataframe.dropna(subset=["date"]).copy()

    if "year" not in dataframe.columns:
        dataframe["year"] = dataframe["date"].dt.year

    if "month" not in dataframe.columns:
        dataframe["month"] = dataframe["date"].dt.month

    if "day" not in dataframe.columns:
        dataframe["day"] = dataframe["date"].dt.day

    dataframe["date"] = dataframe["date"].dt.strftime("%Y-%m-%d")

    rows = clean_records(
        dataframe[
            ["date", "year", "month", "day"]
        ].drop_duplicates(subset=["date"])
    )

    query = """
    UNWIND $rows AS row

    MERGE (d:Date {
        date: date(row.date)
    })

    SET d.year = toInteger(row.year),
        d.month = toInteger(row.month),
        d.day = toInteger(row.day)
    """

    print("Date 적재 시작")
    run_batch(session, query, rows)


def seed_sales(session, dataframe):
    dataframe = rename_columns(
        dataframe,
        {
            "saleId": [
                "판매번호",
                "판매ID",
                "주문번호",
                "SaleId",
                "Sale ID",
                "OrderId",
                "Order ID",
            ],
            "date": [
                "날짜",
                "주문일자",
                "판매일자",
                "Date",
            ],
            "productCode": [
                "제품코드",
                "ProductCode",
                "Product Code",
            ],
            "customerCode": [
                "고객코드",
                "CustomerCode",
                "Customer Code",
            ],
            "promotionCode": [
                "프로모션코드",
                "PromotionCode",
                "Promotion Code",
            ],
            "channelCode": [
                "채널코드",
                "ChannelCode",
                "Channel Code",
            ],
            "quantity": [
                "수량",
                "Quantity",
            ],
            "unitPrice": [
                "단가",
                "UnitPrice",
                "Unit Price",
            ],
            "salesAmount": [
                "판매금액",
                "매출액",
                "총판매금액",
                "SalesAmount",
                "Sales Amount",
            ],
        },
    )

    required = [
        "date",
        "productCode",
        "customerCode",
        "promotionCode",
        "channelCode",
        "quantity",
        "unitPrice",
    ]

    missing = [
        column
        for column in required
        if column not in dataframe.columns
    ]

    if missing:
        raise KeyError(
            f"판매 시트에 필요한 컬럼이 없습니다: {missing}\n"
            f"실제 컬럼: {list(dataframe.columns)}"
        )

    dataframe["date"] = pd.to_datetime(
        dataframe["date"],
        errors="coerce",
    )

    dataframe = dataframe.dropna(
        subset=[
            "date",
            "productCode",
            "customerCode",
        ]
    ).copy()

    dataframe["date"] = dataframe["date"].dt.strftime("%Y-%m-%d")

    dataframe["quantity"] = pd.to_numeric(
        dataframe["quantity"],
        errors="coerce",
    ).fillna(0)

    dataframe["unitPrice"] = pd.to_numeric(
        dataframe["unitPrice"],
        errors="coerce",
    ).fillna(0)

    if "salesAmount" not in dataframe.columns:
        dataframe["salesAmount"] = (
            dataframe["quantity"]
            * dataframe["unitPrice"]
        )
    else:
        dataframe["salesAmount"] = pd.to_numeric(
            dataframe["salesAmount"],
            errors="coerce",
        ).fillna(
            dataframe["quantity"] * dataframe["unitPrice"]
        )

    if "saleId" not in dataframe.columns:
        dataframe["saleId"] = [
            f"SALE-{index + 1:06d}"
            for index in range(len(dataframe))
        ]

    columns = [
        "saleId",
        "date",
        "productCode",
        "customerCode",
        "promotionCode",
        "channelCode",
        "quantity",
        "unitPrice",
        "salesAmount",
    ]

    rows = clean_records(dataframe[columns])

    query = """
    UNWIND $rows AS row

    MERGE (s:Sale {
        saleId: toString(row.saleId)
    })

    SET s.quantity = toFloat(row.quantity),
        s.unitPrice = toFloat(row.unitPrice),
        s.salesAmount = toFloat(row.salesAmount)

    WITH s, row

    MATCH (d:Date {
        date: date(row.date)
    })

    MATCH (p:Product {
        productCode: toString(row.productCode)
    })

    MATCH (c:Customer {
        customerCode: toString(row.customerCode)
    })

    MATCH (ch:Channel {
        channelCode: toString(row.channelCode)
    })

    MERGE (s)-[:HAS_DATE]->(d)
    MERGE (s)-[:SOLD_PRODUCT]->(p)
    MERGE (s)-[:PURCHASED_BY]->(c)
    MERGE (s)-[:THROUGH_CHANNEL]->(ch)

    WITH s, row

    OPTIONAL MATCH (pr:Promotion {
        promotionCode: toString(row.promotionCode)
    })

    FOREACH (
        ignored IN CASE
            WHEN pr IS NULL THEN []
            ELSE [1]
        END |
        MERGE (s)-[:USED_PROMOTION]->(pr)
    )
    """

    print("Sale 및 관계 적재 시작")
    run_batch(session, query, rows)


def print_sheet_info(details, sales):
    print("\nDetails.xlsx 시트")

    for sheet_name, dataframe in details.items():
        print(
            f"- {sheet_name}: "
            f"{len(dataframe)}행 / "
            f"{list(dataframe.columns)}"
        )

    print("\nSales.xlsx 시트")

    for sheet_name, dataframe in sales.items():
        print(
            f"- {sheet_name}: "
            f"{len(dataframe)}행 / "
            f"{list(dataframe.columns)}"
        )


def main():
    if not DETAILS_PATH.exists():
        raise FileNotFoundError(
            f"Details.xlsx 파일이 없습니다: {DETAILS_PATH}"
        )

    if not SALES_PATH.exists():
        raise FileNotFoundError(
            f"Sales.xlsx 파일이 없습니다: {SALES_PATH}"
        )

    details = pd.read_excel(
        DETAILS_PATH,
        sheet_name=None,
    )

    sales = pd.read_excel(
        SALES_PATH,
        sheet_name=None,
    )

    print_sheet_info(details, sales)

    driver = GraphDatabase.driver(
        NEO4J_URI,
        auth=(NEO4J_USER, NEO4J_PASSWORD),
    )

    try:
        driver.verify_connectivity()
        print("\nNeo4j 연결 성공")

        with driver.session(
            database=NEO4J_DATABASE
        ) as session:
            create_constraints(session)

            seed_categories(
                session,
                details["분류"],
            )

            seed_product_categories(
                session,
                details["제품분류"],
            )

            seed_products(
                session,
                details["제품"],
            )

            seed_regions(
                session,
                details["지역"],
            )

            seed_customers(
                session,
                details["고객"],
            )

            seed_promotions(
                session,
                details["프로모션"],
            )

            seed_channels(
                session,
                details["채널"],
            )

            seed_dates(
                session,
                details["날짜"],
            )

            seed_sales(
                session,
                sales["판매"],
            )

        print("\n전체 데이터 적재 완료")

    finally:
        driver.close()


if __name__ == "__main__":
    main()