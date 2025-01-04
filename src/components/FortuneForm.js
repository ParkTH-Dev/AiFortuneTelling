import { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  max-width: 42rem;
  margin: 0 auto;
`;

const FormCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(138, 43, 226, 0.2), inset 0 0 30px rgba(138, 43, 226, 0.05);
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, #9c4dcc, #4a1b8c, #9c4dcc);
  }
`;

const FormContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: ${(props) => (props.$large ? "1.125rem" : "1rem")};
  font-weight: ${(props) => (props.$large ? "500" : "400")};
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e9d8fd;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #805ad5;
    box-shadow: 0 0 0 3px rgba(128, 90, 213, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e9d8fd;
  border-radius: 0.5rem;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #805ad5;
    box-shadow: 0 0 0 3px rgba(128, 90, 213, 0.2);
  }
`;

const BirthDateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid rgba(138, 43, 226, 0.3);
  border-radius: 0.8rem;
  transition: all 0.2s;

  &:hover {
    background-color: rgba(138, 43, 226, 0.05);
    border-color: rgba(138, 43, 226, 0.5);
  }
`;

const Checkbox = styled.input`
  width: 1.25rem;
  height: 1.25rem;
  color: #805ad5;
  border-radius: 0.25rem;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(128, 90, 213, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e9d8fd;
  border-radius: 0.5rem;
  min-height: 100px;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: #805ad5;
    box-shadow: 0 0 0 3px rgba(128, 90, 213, 0.2);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #9c4dcc, #4a1b8c);
  color: white;
  font-size: 1.25rem;
  font-weight: 500;
  border-radius: 1rem;
  box-shadow: 0 4px 15px rgba(138, 43, 226, 0.3),
    inset 0 0 10px rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      120deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(138, 43, 226, 0.4);
    background: linear-gradient(135deg, #b44dcc, #5a1b8c);

    &::before {
      left: 100%;
    }
  }
`;

function FortuneForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    birthYear: "",
    birthMonth: "",
    birthDay: "",
    birthTime: "",
    interests: [],
    goal: "",
    question: "",
  });

  const years = Array.from({ length: 100 }, (_, i) => 2024 - i);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const fortuneCategories = [
    { id: "wealth", label: "재물운" },
    { id: "love", label: "연애운" },
    { id: "health", label: "건강운" },
    { id: "general", label: "전반적인 운세" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        interests: checked
          ? [...prev.interests, name]
          : prev.interests.filter((item) => item !== name),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormCard>
        <FormContent>
          <FormGroup>
            <Label $large>이름</Label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력해주세요"
              required
            />
          </FormGroup>

          <BirthDateGrid>
            <FormGroup>
              <Label>출생연도</Label>
              <Select
                name="birthYear"
                value={formData.birthYear}
                onChange={handleChange}
                required
              >
                <option value="">선택</option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}년
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>월</Label>
              <Select
                name="birthMonth"
                value={formData.birthMonth}
                onChange={handleChange}
                required
              >
                <option value="">선택</option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>일</Label>
              <Select
                name="birthDay"
                value={formData.birthDay}
                onChange={handleChange}
                required
              >
                <option value="">선택</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>시간</Label>
              <Select
                name="birthTime"
                value={formData.birthTime}
                onChange={handleChange}
              >
                <option value="">선택</option>
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}시
                  </option>
                ))}
              </Select>
            </FormGroup>
          </BirthDateGrid>

          <FormGroup>
            <Label $large>관심 운세 항목</Label>
            <CheckboxGrid>
              {fortuneCategories.map((category) => (
                <CheckboxWrapper key={category.id}>
                  <Checkbox
                    type="checkbox"
                    id={category.id}
                    name={category.id}
                    onChange={handleChange}
                  />
                  <Label htmlFor={category.id}>{category.label}</Label>
                </CheckboxWrapper>
              ))}
            </CheckboxGrid>
          </FormGroup>

          <FormGroup>
            <Label $large>2025년 목표</Label>
            <Textarea
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              placeholder="올해 이루고 싶은 목표를 적어주세요"
              rows="3"
            />
          </FormGroup>

          <FormGroup>
            <Label $large>AI에게 묻고 싶은 질문</Label>
            <Textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="운세와 관련된 질문을 자유롭게 작성해주세요"
              rows="3"
            />
          </FormGroup>

          <SubmitButton type="submit">나의 2025년 운세 보기</SubmitButton>
        </FormContent>
      </FormCard>
    </Form>
  );
}

export default FortuneForm;
