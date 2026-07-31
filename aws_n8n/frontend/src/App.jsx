import {
    useEffect,
    useState,
} from "react";
import styled from "styled-components";

import {
    analyzeMenuBoard,
    getMenuDetail,
} from "./api/menuApi";

import Header from "./components/layout/Header";
import MainLayout from "./components/layout/MainLayout";
import MenuImagePanel from "./components/menu/MenuImagePanel";
import MenuInfoPanel from "./components/menu/MenuInfoPanel";
import OrderPanel from "./components/order/OrderPanel";

const App = () => {
    const [activeTab, setActiveTab] =
        useState("menu");

    const [imageFile, setImageFile] =
        useState(null);

    const [imageUrl, setImageUrl] =
        useState("");

    const [menus, setMenus] =
        useState([]);

    const [selectedMenu, setSelectedMenu] =
        useState(null);

    const [orderItems, setOrderItems] =
        useState([]);

    const [isAnalyzing, setIsAnalyzing] =
        useState(false);

    const [isLoadingDetail, setIsLoadingDetail] =
        useState(false);

    const [menuDetailCache, setMenuDetailCache] =
        useState({});

    useEffect(() => {
        if (!imageFile) {
            setImageUrl("");
            return;
        }

        const objectUrl =
            URL.createObjectURL(imageFile);

        setImageUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [imageFile]);

    const normalizeMenu = (menu, index) => {
        const menuName =
            menu.menuName ||
            menu.menu_name ||
            menu.name ||
            "";

        const price = Number(
            String(menu.price ?? "").replace(
                /[^0-9]/g,
                "",
            ),
        );

        const sourceBox =
            menu.box ||
            menu.boundingBox ||
            menu.bounding_box ||
            {};

        const x = Number(
            sourceBox.x ??
            sourceBox.left ??
            sourceBox.xmin ??
            0,
        );

        const y = Number(
            sourceBox.y ??
            sourceBox.top ??
            sourceBox.ymin ??
            0,
        );

        let width = Number(
            sourceBox.width ?? 0,
        );

        let height = Number(
            sourceBox.height ?? 0,
        );

        if (
            !width &&
            sourceBox.xmax !== undefined
        ) {
            width =
                Number(sourceBox.xmax) - x;
        }

        if (
            !height &&
            sourceBox.ymax !== undefined
        ) {
            height =
                Number(sourceBox.ymax) - y;
        }

        const safeX = Math.max(
            0,
            Math.min(1000, x),
        );

        const safeY = Math.max(
            0,
            Math.min(1000, y),
        );

        const safeWidth = Math.max(
            0,
            Math.min(1000 - safeX, width),
        );

        const safeHeight = Math.max(
            0,
            Math.min(1000 - safeY, height),
        );

        return {
            id:
                menu.id ||
                `menu-${index + 1}-${menuName}-${price}`,
            section: menu.section || "",
            menuName,
            price,
            box: {
                x: safeX,
                y: safeY,
                width: safeWidth,
                height: safeHeight,
            },
        };
    };

    const handleImageChange = async (file) => {
        setImageFile(file);
        setMenus([]);
        setSelectedMenu(null);
        setMenuDetailCache({});
        setActiveTab("menu");
        setIsAnalyzing(true);

        try {
            const result =
                await analyzeMenuBoard(file);

            console.log(
                "n8n 전체 메뉴 응답:",
                result,
            );

            const normalizedMenus = result.menus
                .map(normalizeMenu)
                .filter(
                    (menu) =>
                        menu.menuName &&
                        menu.price > 0 &&
                        menu.box.width > 0 &&
                        menu.box.height > 0,
                );

            setMenus(normalizedMenus);

            console.table(normalizedMenus);

            if (normalizedMenus.length === 0) {
                alert(
                    "메뉴 이름, 가격, 위치를 찾지 못했습니다.",
                );
            }
        } catch (error) {
            console.error(error);

            alert(
                error.message ||
                "메뉴판 분석 중 오류가 발생했습니다.",
            );
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleMenuSelect = async (menu) => {
        setActiveTab("menu");
        setSelectedMenu(menu);

        const cacheKey = menu.menuName.trim();

        const cachedDetail =
            menuDetailCache[cacheKey];

        if (cachedDetail) {
            setSelectedMenu({
                ...menu,
                ...cachedDetail,
            });

            return;
        }

        try {
            setIsLoadingDetail(true);

            const detail =
                await getMenuDetail(menu.menuName);

            const normalizedDetail = {
                translations: {
                    english:
                        detail.translations?.english ||
                        detail.english ||
                        "",
                    chinese:
                        detail.translations?.chinese ||
                        detail.chinese ||
                        "",
                    japanese:
                        detail.translations?.japanese ||
                        detail.japanese ||
                        "",
                },
                description:
                    detail.description || "",
                flavor: Array.isArray(detail.flavor)
                    ? detail.flavor
                    : [],
                cookingMethod:
                    detail.cookingMethod ||
                    detail.cooking_method ||
                    "",
                ingredients: Array.isArray(
                    detail.ingredients,
                )
                    ? detail.ingredients
                    : [],
                allergens: Array.isArray(
                    detail.allergens,
                )
                    ? detail.allergens
                    : [],
                nutrition: {
                    calories:
                        detail.nutrition?.calories ||
                        "",
                    protein:
                        detail.nutrition?.protein ||
                        "",
                    carbohydrates:
                        detail.nutrition
                            ?.carbohydrates || "",
                    fat:
                        detail.nutrition?.fat || "",
                },
            };

            setSelectedMenu({
                ...menu,
                ...normalizedDetail,
            });

            setMenuDetailCache((current) => ({
                ...current,
                [cacheKey]: normalizedDetail,
            }));
        } catch (error) {
            console.error(error);

            alert(
                error.message ||
                "메뉴 상세정보를 가져오지 못했습니다.",
            );
        } finally {
            setIsLoadingDetail(false);
        }
    };

    const handleAddOrder = (menu) => {
        setOrderItems((currentItems) => {
            const existingItem =
                currentItems.find(
                    (item) => item.id === menu.id,
                );

            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === menu.id
                        ? {
                            ...item,
                            quantity:
                                item.quantity + 1,
                        }
                        : item,
                );
            }

            return [
                ...currentItems,
                {
                    id: menu.id,
                    menuName: menu.menuName,
                    translatedName:
                        menu.translations?.english ||
                        "",
                    price: menu.price,
                    quantity: 1,
                },
            ];
        });
    };

    const handleIncrease = (menuId) => {
        setOrderItems((currentItems) =>
            currentItems.map((item) =>
                item.id === menuId
                    ? {
                        ...item,
                        quantity:
                            item.quantity + 1,
                    }
                    : item,
            ),
        );
    };

    const handleDecrease = (menuId) => {
        setOrderItems((currentItems) =>
            currentItems
                .map((item) =>
                    item.id === menuId
                        ? {
                            ...item,
                            quantity:
                                item.quantity - 1,
                        }
                        : item,
                )
                .filter(
                    (item) => item.quantity > 0,
                ),
        );
    };

    const handleRemove = (menuId) => {
        setOrderItems((currentItems) =>
            currentItems.filter(
                (item) => item.id !== menuId,
            ),
        );
    };

    const handleClear = () => {
        if (orderItems.length === 0) {
            return;
        }

        const confirmed = window.confirm(
            "주문 목록을 모두 삭제하시겠습니까?",
        );

        if (confirmed) {
            setOrderItems([]);
        }
    };

    const totalQuantity =
        orderItems.reduce(
            (total, item) =>
                total + item.quantity,
            0,
        );

    return (
        <>
            <Header />

            <MainLayout
                left={
                    <MenuImagePanel
                        imageUrl={imageUrl}
                        menus={menus}
                        selectedMenu={selectedMenu}
                        onImageChange={
                            handleImageChange
                        }
                        onMenuSelect={
                            handleMenuSelect
                        }
                        isAnalyzing={
                            isAnalyzing
                        }
                    />
                }
                right={
                    <Panel>
                        <Tabs>
                            <TabButton
                                type="button"
                                $active={
                                    activeTab === "menu"
                                }
                                onClick={() =>
                                    setActiveTab("menu")
                                }
                            >
                                메뉴 정보
                            </TabButton>

                            <TabButton
                                type="button"
                                $active={
                                    activeTab === "order"
                                }
                                onClick={() =>
                                    setActiveTab("order")
                                }
                            >
                                주문 목록

                                {totalQuantity > 0 && (
                                    <CountBadge>
                                        {totalQuantity}
                                    </CountBadge>
                                )}
                            </TabButton>
                        </Tabs>

                        <PanelContent>
                            {activeTab === "menu" ? (
                                <MenuInfoPanel
                                    menu={selectedMenu}
                                    isLoading={
                                        isLoadingDetail
                                    }
                                    onAddOrder={
                                        handleAddOrder
                                    }
                                />
                            ) : (
                                <OrderPanel
                                    orderItems={
                                        orderItems
                                    }
                                    onIncrease={
                                        handleIncrease
                                    }
                                    onDecrease={
                                        handleDecrease
                                    }
                                    onRemove={
                                        handleRemove
                                    }
                                    onClear={
                                        handleClear
                                    }
                                />
                            )}
                        </PanelContent>
                    </Panel>
                }
            />
        </>
    );
};

export default App;

const Panel = styled.div`
    overflow: hidden;
    min-height: calc(100vh - 116px);
    border: 1px solid #e0e6ef;
    border-radius: 20px;
    background: #ffffff;
    box-shadow: 0 12px 30px rgba(34, 55, 88, 0.08);
`;

const Tabs = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding: 8px;
    border-bottom: 1px solid #e4eaf2;
    background: #f7f9fc;
`;

const TabButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 12px;
    border-radius: 11px;
    background: ${({ $active }) =>
            $active ? "#ffffff" : "transparent"};
    color: ${({ $active }) =>
            $active ? "#1769d2" : "#778398"};
    font-weight: 700;
    box-shadow: ${({ $active }) =>
            $active
                    ? "0 3px 10px rgba(45, 78, 120, 0.1)"
                    : "none"};
`;

const CountBadge = styled.span`
    display: grid;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    place-items: center;
    border-radius: 999px;
    background: #287de5;
    color: #ffffff;
    font-size: 11px;
`;

const PanelContent = styled.div`
    max-height: calc(100vh - 194px);
    overflow-y: auto;
    padding: 22px;
`;