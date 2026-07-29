import {
    useEffect,
    useRef,
    useState,
} from "react";
import styled from "styled-components";

import {
    askMenuQuestion,
} from "../../api/menuApi";

const QUICK_QUESTIONS = [
    "Is this spicy?",
    "Does this contain pork?",
    "Is this vegetarian?",
    "Does this contain peanuts?",
];

const MenuChat = ({
                      menu,
                  }) => {
    const [
        messages,
        setMessages,
    ] = useState([]);

    const [
        question,
        setQuestion,
    ] = useState("");

    const [
        audioFile,
        setAudioFile,
    ] = useState(null);

    const [
        isLoading,
        setIsLoading,
    ] = useState(false);

    const fileInputRef =
        useRef(null);

    const messagesEndRef =
        useRef(null);

    useEffect(() => {
        setMessages([]);
        setQuestion("");
        setAudioFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value =
                "";
        }
    }, [menu?.id]);

    useEffect(() => {
        messagesEndRef.current
            ?.scrollIntoView({
                behavior: "smooth",
            });
    }, [messages, isLoading]);

    const handleAudioChange = (event) => {
        const file =
            event.target.files?.[0];

        console.log(
            "선택된 오디오 파일:",
            file,
        );

        if (!file) {
            setAudioFile(null);
            return;
        }

        console.log(
            "파일 이름:",
            file.name,
        );

        console.log(
            "파일 형식:",
            file.type,
        );

        console.log(
            "파일 크기:",
            file.size,
        );

        setAudioFile(file);
    };

    const handleQuickQuestion = (
        value,
    ) => {
        setQuestion(value);
    };

    const handleSubmit = async (
        event,
    ) => {
        event.preventDefault();

        if (!menu) {
            alert(
                "Please select a menu first.",
            );
            return;
        }

        if (
            !question.trim() &&
            !audioFile
        ) {
            alert(
                "Please type a question or choose an audio file.",
            );
            return;
        }

        try {
            setIsLoading(true);
            console.log(
                "전송 직전 audioFile:",
                audioFile,
            );
            const result =
                await askMenuQuestion({
                    menu,
                    question,
                    audioFile,
                });

            const transcript =
                result.transcript?.trim();

            const answer =
                result.answer?.trim();

            const newMessages = [];

            if (transcript) {
                newMessages.push({
                    id:
                        crypto.randomUUID(),
                    role: "user",
                    content: transcript,
                });
            }

            if (answer) {
                newMessages.push({
                    id:
                        crypto.randomUUID(),
                    role: "assistant",
                    content: answer,
                });
            }

            setMessages(
                (currentMessages) => [
                    ...currentMessages,
                    ...newMessages,
                ],
            );

            setQuestion("");
            setAudioFile(null);

            if (fileInputRef.current) {
                fileInputRef.current.value =
                    "";
            }
        } catch (error) {
            console.error(
                "Menu chat error:",
                error,
            );

            alert(
                error.message ||
                "Failed to process the question.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    if (!menu) {
        return (
            <Container>
                <Title>
                    Ask about this menu
                </Title>

                <EmptyMessage>
                    Select a menu to ask a
                    question.
                </EmptyMessage>
            </Container>
        );
    }

    return (
        <Container>
            <Header>
                <div>
                    <Title>
                        Ask about this menu
                    </Title>

                    <Subtitle>
                        Ask by text or upload
                        an English audio file.
                    </Subtitle>
                </div>

                <MenuBadge>
                    {menu.translations
                            ?.english ||
                        menu.menuName}
                </MenuBadge>
            </Header>

            <QuickQuestions>
                {QUICK_QUESTIONS.map(
                    (item) => (
                        <QuickButton
                            key={item}
                            type="button"
                            onClick={() =>
                                handleQuickQuestion(
                                    item,
                                )
                            }
                            disabled={
                                isLoading
                            }
                        >
                            {item}
                        </QuickButton>
                    ),
                )}
            </QuickQuestions>

            <Messages>
                {messages.length === 0 &&
                !isLoading ? (
                    <EmptyMessage>
                        Your transcribed question
                        and the AI response will
                        appear here.
                    </EmptyMessage>
                ) : (
                    messages.map(
                        (message) => (
                            <MessageRow
                                key={message.id}
                                $role={
                                    message.role
                                }
                            >
                                <MessageLabel>
                                    {message.role ===
                                    "user"
                                        ? "You"
                                        : "AI"}
                                </MessageLabel>

                                <MessageBubble
                                    $role={
                                        message.role
                                    }
                                >
                                    {
                                        message.content
                                    }
                                </MessageBubble>
                            </MessageRow>
                        ),
                    )
                )}

                {isLoading && (
                    <MessageRow
                        $role="assistant"
                    >
                        <MessageLabel>
                            AI
                        </MessageLabel>

                        <MessageBubble
                            $role="assistant"
                        >
                            Transcribing and
                            generating an answer...
                        </MessageBubble>
                    </MessageRow>
                )}

                <div ref={messagesEndRef} />
            </Messages>

            <Form
                onSubmit={handleSubmit}
            >
                <InputRow>
                    <TextInput
                        type="text"
                        value={question}
                        onChange={(event) =>
                            setQuestion(
                                event.target.value,
                            )
                        }
                        placeholder="Type a question..."
                        disabled={isLoading}
                    />

                    <SendButton
                        type="submit"
                        disabled={
                            isLoading ||
                            (!question.trim() &&
                                !audioFile)
                        }
                    >
                        {isLoading
                            ? "Sending..."
                            : "Send"}
                    </SendButton>
                </InputRow>

                <AudioRow>
                    <AudioLabel>
                        <AudioInput
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*,.mp3,.wav,.m4a,.webm"
                            onChange={handleAudioChange}
                            disabled={isLoading}
                        />

                        Choose audio file
                    </AudioLabel>

                    <FileName>
                        {audioFile
                            ? audioFile.name
                            : "No audio file selected"}
                    </FileName>

                    {audioFile && (
                        <RemoveAudioButton
                            type="button"
                            onClick={() => {
                                setAudioFile(
                                    null,
                                );

                                if (
                                    fileInputRef.current
                                ) {
                                    fileInputRef.current.value =
                                        "";
                                }
                            }}
                            disabled={
                                isLoading
                            }
                        >
                            Remove
                        </RemoveAudioButton>
                    )}
                </AudioRow>
            </Form>
        </Container>
    );
};

export default MenuChat;

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 24px;
  padding-top: 22px;
  border-top: 1px solid #e4e9f1;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

const Title = styled.h3`
  margin: 0;
  color: #172033;
  font-size: 17px;
`;

const Subtitle = styled.p`
  margin: 5px 0 0;
  color: #7b879c;
  font-size: 12px;
  line-height: 1.5;
`;

const MenuBadge = styled.span`
  max-width: 170px;
  overflow: hidden;
  padding: 7px 10px;
  border-radius: 999px;
  background: #edf5ff;
  color: #287de5;
  font-size: 12px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const QuickQuestions =
    styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 7px;
  `;

const QuickButton =
    styled.button`
    padding: 7px 10px;
    border: 1px solid #d9e3f1;
    border-radius: 999px;
    background: #ffffff;
    color: #4b5870;
    font-size: 11px;
    cursor: pointer;

    &:hover:not(:disabled) {
      border-color: #287de5;
      color: #287de5;
    }

    &:disabled {
      cursor: not-allowed;
      opacity: 0.55;
    }
  `;

const Messages = styled.div`
  display: flex;
  min-height: 180px;
  max-height: 340px;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding: 14px;
  border: 1px solid #e1e7ef;
  border-radius: 14px;
  background: #f8fafc;
`;

const EmptyMessage = styled.p`
  margin: auto;
  color: #8994a7;
  font-size: 13px;
  line-height: 1.6;
  text-align: center;
`;

const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $role }) =>
    $role === "user"
        ? "flex-end"
        : "flex-start"};
  gap: 5px;
`;

const MessageLabel = styled.span`
  color: #7d8799;
  font-size: 11px;
  font-weight: 700;
`;

const MessageBubble =
    styled.div`
    max-width: 86%;
    padding: 10px 12px;
    border-radius: ${({ $role }) =>
        $role === "user"
            ? "14px 14px 4px 14px"
            : "14px 14px 14px 4px"};
    background: ${({ $role }) =>
        $role === "user"
            ? "#287de5"
            : "#ffffff"};
    color: ${({ $role }) =>
        $role === "user"
            ? "#ffffff"
            : "#344054"};
    box-shadow: ${({ $role }) =>
        $role === "assistant"
            ? "0 3px 10px rgba(36, 52, 78, 0.08)"
            : "none"};
    font-size: 13px;
    line-height: 1.55;
    white-space: pre-wrap;
  `;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
`;

const TextInput = styled.input`
  min-width: 0;
  flex: 1;
  padding: 11px 12px;
  border: 1px solid #dce3ed;
  border-radius: 10px;
  outline: none;
  color: #344054;
  font-size: 13px;

  &:focus {
    border-color: #287de5;
    box-shadow:
      0 0 0 3px
      rgba(40, 125, 229, 0.1);
  }

  &:disabled {
    background: #f3f5f8;
  }
`;

const SendButton = styled.button`
  min-width: 84px;
  padding: 0 15px;
  border: 0;
  border-radius: 10px;
  background: #287de5;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    background: #a9bfdc;
  }
`;

const AudioRow = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
`;

const AudioLabel = styled.label`
  flex-shrink: 0;
  padding: 8px 10px;
  border: 1px solid #d9e3f1;
  border-radius: 9px;
  background: #ffffff;
  color: #42516a;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`;

const AudioInput = styled.input`
  display: none;
`;

const FileName = styled.span`
  min-width: 0;
  overflow: hidden;
  flex: 1;
  color: #7b879c;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const RemoveAudioButton =
    styled.button`
    flex-shrink: 0;
    padding: 6px 8px;
    border: 0;
    background: transparent;
    color: #e04d4d;
    font-size: 11px;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `;