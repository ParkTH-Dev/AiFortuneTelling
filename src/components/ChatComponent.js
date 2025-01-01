import { useState } from "react";
import OpenAI from "openai";

function ChatComponent() {
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true, // 브라우저에서 API 호출을 위해 필요
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: "테스트 메시지입니다." }],
        model: "gpt-4-turbo-preview",
      });

      setResponse(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "로딩중..." : "API 테스트"}
      </button>
      <div>{response}</div>
    </div>
  );
}

export default ChatComponent;
