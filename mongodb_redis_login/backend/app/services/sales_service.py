from app.config.mongodb import sales_collection


def get_dashboard():

    pipeline = [
        {
            "$addFields": {
                "매출액": {
                    "$multiply": [
                        "$수량",
                        "$단가",
                        {
                            "$subtract": [
                                1,
                                "$할인율"
                            ]
                        }
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": None,
                "total_sales": {
                    "$sum": "$매출액"
                },
                "total_quantity": {
                    "$sum": "$수량"
                },
                "total_orders": {
                    "$sum": 1
                },
                "customers": {
                    "$addToSet": "$고객명"
                }
            }
        },
        {
            "$project": {
                "_id": 0,
                "total_sales": 1,
                "total_quantity": 1,
                "total_orders": 1,
                "customer_count": {
                    "$size": "$customers"
                }
            }
        }
    ]

    result = list(
        sales_collection.aggregate(pipeline)
    )

    if not result:
        return {
            "total_sales": 0,
            "total_quantity": 0,
            "total_orders": 0,
            "customer_count": 0
        }

    return result[0]

def get_top_products():

    pipeline = [
        {
            "$addFields": {
                "매출액": {
                    "$multiply": [
                        "$수량",
                        "$단가",
                        {
                            "$subtract": [
                                1,
                                "$할인율"
                            ]
                        }
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": "$제품명",
                "sales": {
                    "$sum": "$매출액"
                },
                "quantity": {
                    "$sum": "$수량"
                }
            }
        },
        {
            "$sort": {
                "sales": -1
            }
        },
        {
            "$limit": 5
        },
        {
            "$project": {
                "_id": 0,
                "product_name": "$_id",
                "sales": 1,
                "quantity": 1
            }
        }
    ]

    return list(
        sales_collection.aggregate(pipeline)
    )
def get_category_sales():

    pipeline = [
        {
            "$addFields": {
                "매출액": {
                    "$multiply": [
                        "$수량",
                        "$단가",
                        {
                            "$subtract": [
                                1,
                                "$할인율"
                            ]
                        }
                    ]
                }
            }
        },
        {
            "$group": {
                "_id": "$분류명",
                "sales": {
                    "$sum": "$매출액"
                }
            }
        },
        {
            "$sort": {
                "sales": -1
            }
        },
        {
            "$project": {
                "_id": 0,
                "category": "$_id",
                "sales": 1
            }
        }
    ]

    return list(
        sales_collection.aggregate(pipeline)
    )