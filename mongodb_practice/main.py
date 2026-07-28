from pymongo import MongoClient
import pandas as pd

client = MongoClient(
    "mongodb://admin:1234@localhost:27017/mydb?authSource=admin"
)

db = client["mydb"]
product_collection = db["products"] # product collection 생성
promotion_collection = db["promotions"]
customers_collection = db["customers"]
channels_collection = db["channels"]
sales_collection = db["sales"]

if __name__ == "__main__":
    details = pd.read_excel("./data/Details.xlsx", sheet_name=None)
    product = details["제품"]
    product_category = details["제품분류"]
    category = details["분류"]
    promotion = details["프로모션"]
    customer = details["2018년도~2022년도 주문고객"]
    region = details["지역"]
    channel = details["채널"]


    products = (product_category
                .merge(category,on="분류코드", how="left")
                .merge(product, on="제품분류코드", how="right")
                [['제품코드', '제품분류명', '분류명', '제품명', '색상', '원가', '단가']])
    customers = (customer
                 .merge(region, on="지역코드", how="left")
                 [['고객코드', '고객명', '성별', '생년월일', '시도', '구군시', '지역']])
    # products_json = products.to_dict(orient="records")
    # customers_json = customers.to_dict(orient="records")
    # promotions_json = promotion.to_dict(orient="records")
    # channels_json = channel.to_dict(orient="records")
    #
    # db.products.insert_many(products_json)
    # db.customers.insert_many(customers_json)
    # db.promotions.insert_many(promotions_json)
    # db.channels.insert_many(channels_json)

    sales_xl = pd.read_excel("./data/Sales.xlsx")
    sales = (sales_xl
             .merge(products, on="제품코드", how="left")
             .merge(customers, on="고객코드", how="left")
             .merge(promotion, on="프로모션코드", how="left")
             .merge(channel, on="채널코드", how="left")
            [['날짜', 'Quantity',
       '제품분류명', '분류명', '제품명', '색상', '원가', '단가', '고객명', '성별', '생년월일', '시도',
       '구군시', '지역_y', '프로모션', '할인율', '채널명']]
             )
    sales.rename(
        columns={
            "Quantity": "수량",
            "지역_y": "지역"
        },
        inplace=True
    )
    sales_json = sales.to_dict(orient="records")
    db.sales.insert_many(sales_json)