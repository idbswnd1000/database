const MENU_ANALYZE_URL =
    import.meta.env.VITE_N8N_MENU_ANALYZE_URL;

const MENU_DETAIL_URL =
    import.meta.env.VITE_N8N_MENU_DETAIL_URL;

const MENU_CHAT_URL =
    import.meta.env.VITE_N8N_MENU_CHAT_URL;

const parseResponse = async (
    response,
    defaultMessage,
) => {
    const responseText =
        await response.text();

    if (!response.ok) {
        throw new Error(
            responseText ||
            `${defaultMessage} (${response.status})`,
        );
    }

    if (!responseText.trim()) {
        throw new Error(
            "n8n에서 빈 응답이 반환되었습니다.",
        );
    }

    try {
        return JSON.parse(responseText);
    } catch {
        console.error(
            "n8n 원본 응답:",
            responseText,
        );

        throw new Error(
            "n8n 응답이 올바른 JSON 형식이 아닙니다.",
        );
    }
};

export const analyzeMenuBoard = async (
    imageFile,
) => {
    if (!MENU_ANALYZE_URL) {
        throw new Error(
            "VITE_N8N_MENU_ANALYZE_URL이 설정되지 않았습니다.",
        );
    }

    const formData =
        new FormData();

    formData.append(
        "image",
        imageFile,
        imageFile.name,
    );

    const response = await fetch(
        MENU_ANALYZE_URL,
        {
            method: "POST",
            body: formData,
        },
    );

    const result =
        await parseResponse(
            response,
            "메뉴판 분석에 실패했습니다.",
        );

    if (result.error) {
        throw new Error(
            result.message ||
            "메뉴판 분석에 실패했습니다.",
        );
    }

    if (!Array.isArray(result.menus)) {
        throw new Error(
            "n8n 응답에 menus 배열이 없습니다.",
        );
    }

    return result;
};

export const getMenuDetail = async (
    menuName,
) => {
    if (!MENU_DETAIL_URL) {
        throw new Error(
            "VITE_N8N_MENU_DETAIL_URL이 설정되지 않았습니다.",
        );
    }

    const response = await fetch(
        MENU_DETAIL_URL,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
            },
            body: JSON.stringify({
                menuName,
            }),
        },
    );

    const result =
        await parseResponse(
            response,
            "메뉴 상세정보 요청에 실패했습니다.",
        );

    if (result.error) {
        throw new Error(
            result.message ||
            "메뉴 상세정보를 가져오지 못했습니다.",
        );
    }

    return result;
};

export const askMenuQuestion = async ({
                                          menu,
                                          question,
                                          audioFile,
                                      }) => {
    if (!MENU_CHAT_URL) {
        throw new Error(
            "VITE_N8N_MENU_CHAT_URL이 설정되지 않았습니다.",
        );
    }

    if (!menu) {
        throw new Error(
            "메뉴를 먼저 선택해주세요.",
        );
    }

    const normalizedQuestion =
        question?.trim() || "";

    const hasAudioFile =
        audioFile instanceof File;

    if (
        !normalizedQuestion &&
        !hasAudioFile
    ) {
        throw new Error(
            "질문을 입력하거나 음성파일을 선택해주세요.",
        );
    }

    const formData =
        new FormData();

    formData.append(
        "menuName",
        menu.menuName || "",
    );

    formData.append(
        "translatedName",
        menu.translations?.english ||
        menu.originalName ||
        menu.menuName ||
        "",
    );

    formData.append(
        "description",
        menu.description || "",
    );

    formData.append(
        "ingredients",
        JSON.stringify(
            menu.ingredients || [],
        ),
    );

    formData.append(
        "allergens",
        JSON.stringify(
            menu.allergens || [],
        ),
    );

    formData.append(
        "flavor",
        JSON.stringify(
            menu.flavor || [],
        ),
    );

    formData.append(
        "cookingMethod",
        menu.cookingMethod || "",
    );

    if (normalizedQuestion) {
        formData.append(
            "question",
            normalizedQuestion,
        );
    }

    if (hasAudioFile) {
        formData.append(
            "audio",
            audioFile,
            audioFile.name,
        );
    }

    console.log(
        "전송할 audioFile:",
        audioFile,
    );

    for (
        const [key, value]
        of formData.entries()
        ) {
        if (value instanceof File) {
            console.log(
                "FormData 파일:",
                {
                    key,
                    name: value.name,
                    type: value.type,
                    size: value.size,
                },
            );
        } else {
            console.log(
                "FormData 값:",
                key,
                value,
            );
        }
    }

    const response = await fetch(
        MENU_CHAT_URL,
        {
            method: "POST",
            body: formData,
        },
    );

    const responseText =
        await response.text();

    let result;

    try {
        result = responseText
            ? JSON.parse(responseText)
            : {};
    } catch {
        console.error(
            "음성 질문 원본 응답:",
            responseText,
        );

        throw new Error(
            "음성 질문 응답이 올바른 JSON 형식이 아닙니다.",
        );
    }

    if (!response.ok) {
        throw new Error(
            result.message ||
            "음성 질문 요청에 실패했습니다.",
        );
    }

    if (result.error) {
        throw new Error(
            result.message ||
            "음성 질문 처리 중 오류가 발생했습니다.",
        );
    }

    return {
        transcript:
            result.transcript ||
            result.question ||
            normalizedQuestion,
        answer:
            result.answer ||
            result.response ||
            "",
    };
};