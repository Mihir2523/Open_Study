import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from models.quiz import QuizGen

# ==== 2. Quiz Generator Utility ====
class QuizGenerator:
    """
    Utility for generating quizzes using Google Gemini via LangChain.
    """

    def __init__(self, model: str = "gemini-2.0-flash", temperature: float = 0.3):
        self.llm = ChatGoogleGenerativeAI(
            model=model,
            temperature=temperature,
            model_kwargs={
                "generation_config": {
                    "response_mime_type": "application/json"
                }
            }
        )
        self.quiz_llm = self.llm.with_structured_output(QuizGen)
        self.prompt_template = PromptTemplate.from_template("""
You are a quiz generator AI assistant.

Given the following text:
{text}

Generate exactly {count} questions of type "{qtype}" with difficulty "{difficulty}".

Return only valid JSON that strictly matches this following format:

{{
  "questions": [
    {{
      "question": "<question text>",
      "options": [<list of options with {option_count} options count; empty list for true/false>],
      "type": "<mcq or true_false>",
      "weightage": "<{weightage} marks for the question>",
      "difficulty": "<easy, medium, or hard>"
    }},
    "answers: [<index of correct answer for each question, 0-based indexing>]
    ...
  ],
  
}}
""")

    def generate(self, text: str, count: int, qtype: str, difficulty: str, weightage: str, option_count: int) -> QuizGen:
        """
        Generate a quiz from given text.
        """
        params = {
            "text": text,
            "count": count,
            "qtype": qtype,
            "difficulty": difficulty,
            "weightage": weightage,
            "option_count": option_count
        }
        prompt = self.prompt_template.format(**params)
        # print(prompt)
        return self.quiz_llm.invoke(prompt)

    def generate_as_json(self, text: str, count: int, qtype: str, difficulty: str, weightage: str, option_count: int) -> str:
        """
        Generate a quiz and return it as a JSON string.
        """
        quiz = self.generate(text, count, qtype, difficulty, weightage, option_count)
        return json.dumps(quiz.model_dump(), indent=2)