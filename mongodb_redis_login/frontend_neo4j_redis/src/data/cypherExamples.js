export const CYPHER_EXAMPLES = [
    {
        id: "customer-product",
        name: "고객 → 판매 → 상품",
        query: `MATCH path =
(customer:Customer)<-[:PURCHASED_BY]-(sale:Sale)-[:SOLD_PRODUCT]->
(product:Product)
RETURN path
LIMIT 30`,
    },
    {
        id: "product-category",
        name: "상품 → 상품분류 → 카테고리",
        query: `MATCH path =
(product:Product)-[:BELONGS_TO]->(productCategory:ProductCategory)
-[:BELONGS_TO]->(category:Category)
RETURN path
LIMIT 30`,
    },
    {
        id: "customer-region",
        name: "고객 → 지역",
        query: `MATCH path =
(customer:Customer)-[:LIVES_IN]->(region:Region)
RETURN path
LIMIT 30`,
    },
    {
        id: "sale-channel",
        name: "판매 → 채널",
        query: `MATCH path =
(sale:Sale)-[:THROUGH_CHANNEL]->(channel:Channel)
RETURN path
LIMIT 30`,
    },
    {
        id: "sale-promotion",
        name: "판매 → 프로모션",
        query: `MATCH path =
(sale:Sale)-[:USED_PROMOTION]->(promotion:Promotion)
RETURN path
LIMIT 30`,
    },
    {
        id: "sale-detail",
        name: "판매 전체 관계",
        query: `MATCH (sale:Sale)
OPTIONAL MATCH path1 =
(sale)-[:PURCHASED_BY]->(customer:Customer)
OPTIONAL MATCH path2 =
(sale)-[:SOLD_PRODUCT]->(product:Product)
OPTIONAL MATCH path3 =
(sale)-[:THROUGH_CHANNEL]->(channel:Channel)
OPTIONAL MATCH path4 =
(sale)-[:USED_PROMOTION]->(promotion:Promotion)
RETURN path1, path2, path3, path4
LIMIT 30`,
    },
    {
        id: "overview",
        name: "전체 그래프",
        query: `MATCH path = (source)-[relationship]->(target)
RETURN path
LIMIT 50`,
    },
];