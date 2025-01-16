import FortuneForm from "./components/FortuneForm";
import { useState } from "react";
import OpenAI from "openai";
import styled from "styled-components";

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(45deg, #1a0b2e, #321b5a, #1a0b2e);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  padding: 3rem 1rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: fixed;
    width: 2px;
    height: 2px;
    background: white;
    box-shadow: 0 0 20px white,
      ${[...Array(50)]
          .map(() => {
            const x = Math.floor(Math.random() * 100);
            const y = Math.floor(Math.random() * 100);
            return `${x}vw ${y}vh 1px rgba(255, 255, 255, 0.8),`;
          })
          .join("")}
        0 0 0 transparent;
  }

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1rem;
  color: white;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.3),
    0 0 20px rgba(138, 43, 226, 0.2), 0 0 30px rgba(138, 43, 226, 0.1);
  letter-spacing: 4px;
  background: linear-gradient(to right, #fff, #e9d8fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: glow 2s ease-in-out infinite alternate;
  font-family: "Noto Serif KR", serif;
  position: relative;

  &::after {
    content: "2025";
    position: absolute;
    top: -0.5rem;
    right: -0.5rem;
    font-size: 1rem;
    color: #e9d8fd;
    -webkit-text-fill-color: #e9d8fd;
    text-shadow: none;
    opacity: 0.8;
  }

  @keyframes glow {
    from {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.3),
        0 0 20px rgba(138, 43, 226, 0.2), 0 0 30px rgba(138, 43, 226, 0.1);
    }
    to {
      text-shadow: 0 0 20px rgba(255, 255, 255, 0.4),
        0 0 30px rgba(138, 43, 226, 0.3), 0 0 40px rgba(138, 43, 226, 0.2);
    }
  }

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  text-align: center;
  color: #e9d8fd;
  margin-bottom: 3rem;
  font-size: 1.125rem;
`;

const ResultCard = styled.div`
  max-width: 48rem;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.3);
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  font-family: "Noto Serif KR", serif;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 1.5rem;
    padding: 2px;
    background: linear-gradient(45deg, #9c4dcc, transparent, #4a1b8c);
    -webkit-mask: linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
`;

const FortuneText = styled.pre`
  white-space: pre-wrap;
  color: #2d3748;
  font-family: "Noto Serif KR", serif;
  line-height: 2;
  font-size: 1.125rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 1rem;
  box-shadow: inset 0 0 20px rgba(138, 43, 226, 0.1);
  margin-bottom: 1rem;

  & strong {
    color: #4a1b8c;
    font-weight: 600;
  }
`;

const ButtonContainer = styled.div`
  text-align: center;
  margin-top: 2rem;
`;

const Button = styled.button`
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #9c4dcc, #4a1b8c);
  color: white;
  border-radius: 9999px;
  font-weight: 500;
  font-size: 1.1rem;
  box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(138, 43, 226, 0.4);
    background: linear-gradient(135deg, #b44dcc, #5a1b8c);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const Spinner = styled.div`
  width: 5rem;
  height: 5rem;
  border: 5px solid #9c4dcc;
  border-top-color: transparent;
  border-radius: 50%;
  margin: 0 auto 1.5rem;
  animation: spin 1s linear infinite;
  box-shadow: 0 0 15px rgba(138, 43, 226, 0.3),
    inset 0 0 15px rgba(138, 43, 226, 0.1);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    border: 2px solid rgba(138, 43, 226, 0.2);
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.div`
  color: white;
  font-size: 1.25rem;
  font-family: "Noto Serif KR", serif;
  text-shadow: 0 0 10px rgba(138, 43, 226, 0.3);
`;

const LoadingSubtext = styled.span`
  display: block;
  color: #e9d8fd;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

function App() {
  const [fortune, setFortune] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  const generateFortune = async (formData) => {
    setIsLoading(true);
    try {
      const prompt = `당신은 신비로운 분위기를 풍기는 40년 경력의 운세 상담가입니다.
미래를 내다보는 듯한 통찰력으로, 내담자의 2025년을 예측하고 길흉화복을 점쳐주세요.

[소중한 내담자 정보]
이름: ${formData.name}
생년월일: ${formData.birthYear}년 ${formData.birthMonth}월 ${
        formData.birthDay
      }일 ${formData.birthTime}시
관심 운세: ${formData.interests.join(", ")}
${formData.goal ? `2025년 목표: ${formData.goal}` : ""}
${formData.question ? `궁금하신 점: ${formData.question}` : ""}

아래 내용을 신비롭고 예언적인 어조로 답변해주세요:

1. 2025년의 운세 흐름
- ${formData.name}님의 2025년은 어떤 기운이 감돌 것인가요?
- 특별히 좋은 기운이 예상되는 시기는 언제일까요?
- 행운을 불러올 수 있는 행동이나 물건은 무엇일까요?

2. 사계절의 운세 변화
- 봄에는 이런 일이 있을 것 같네요...
- 여름이 되면 이런 변화가 찾아올 듯합니다...
- 가을에는 특별히 이것을 조심하시면 좋겠어요...
- 겨울에는 이런 기회가 찾아올 것 같습니다...

3. 관심 분야의 운세
${
  formData.interests.includes("wealth")
    ? "- 재물운: 돈의 흐름이 어떻게 변할 것인지..."
    : ""
}
${
  formData.interests.includes("love")
    ? "- 연애운: 인연의 기운이 어떻게 움직일 것인지..."
    : ""
}
${
  formData.interests.includes("health")
    ? "- 건강운: 건강 관리를 위해 특히 신경 써야 할 부분..."
    : ""
}
${
  formData.interests.includes("general")
    ? "- 전반적인 운: 전체적인 기운의 흐름과 조언..."
    : ""
}

${
  formData.goal
    ? `4. 목표 달성을 위한 운세 풀이
- 이런 시기에 시작하면 좋을 것 같습니다...
- 이런 날은 피하시는 게 좋겠어요...
- 이런 방향으로 가면 성공할 확률이 높아 보입니다...
- 이런 기회가 올 때 놓치지 마세요...`
    : ""
}

${
  formData.question
    ? `5. 질문하신 내용에 대한 점괘
- 이렇게 될 것 같은 기운이 보입니다...
- 이런 상황을 조심하시면 좋겠어요...
- 이런 기회는 꼭 잡으시길 바랍니다...`
    : ""
}

답변은 마치 수정구슬을 들여다보며 미래를 예견하는 것처럼 신비롭게 작성해주세요.
${formData.name}님의 2025년에 찾아올 행운과 기회, 그리고 조심해야 할 점들을 
자세히 풀어서 설명해주세요.

긍정적인 예언을 중심으로 하되, 조심해야 할 점도 완곡하게 표현하여
더 나은 미래를 만들어갈 수 있도록 안내해주세요.`;

      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        model: "gpt-4-turbo-preview",
        temperature: 0.9,
        max_tokens: 2000,
      });

      setFortune(completion.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error);
      alert("죄송합니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container>
      <Wrapper>
        <Title>2025년 신년 운세</Title>
        <Subtitle>당신의 2025년, 무엇을 기대하시나요?</Subtitle>
        {!fortune ? (
          <FortuneForm onSubmit={generateFortune} />
        ) : (
          <ResultCard>
            <FortuneText>{fortune}</FortuneText>
            <ButtonContainer>
              <Button onClick={() => setFortune(null)}>다시 보기</Button>
            </ButtonContainer>
          </ResultCard>
        )}
        {isLoading && (
          <LoadingOverlay>
            <LoadingContent>
              <Spinner />
              <LoadingText>
                운세를 분석중입니다...
                <LoadingSubtext>잠시만 기다려주세요</LoadingSubtext>
              </LoadingText>
            </LoadingContent>
          </LoadingOverlay>
        )}
      </Wrapper>
    </Container>
  );
}

export default App;
