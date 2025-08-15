import json
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from models.quiz import Quiz

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
        self.quiz_llm = self.llm.with_structured_output(Quiz)
        self.prompt_template = PromptTemplate.from_template("""
You are a quiz generator AI assistant.

Given the following text:
{text}

Generate exactly {count} questions of type "{qtype}" with difficulty "{difficulty}".

Return only valid JSON that matches this format:

{{
  "questions": [
    {{
      "question": "<question text>",
      "options": [<list of options with {option_count} options count; empty list for true/false>],
      "answer": "<correct answer>",
      "type": "<mcq or true_false>",
      "difficulty": "<easy, medium, or hard>"
    }},
    ...
  ]
}}
""")

    def generate(self, text: str, count: int, qtype: str, difficulty: str, option_count: int) -> Quiz:
        """
        Generate a quiz from given text.
        """
        params = {
            "text": text,
            "count": count,
            "qtype": qtype,
            "difficulty": difficulty,
            "option_count": option_count
        }
        prompt = self.prompt_template.format(**params)
        return self.quiz_llm.invoke(prompt)

    def generate_as_json(self, text: str, count: int, qtype: str, difficulty: str, option_count: int) -> str:
        """
        Generate a quiz and return it as a JSON string.
        """
        quiz = self.generate(text, count, qtype, difficulty, option_count)
        return json.dumps(quiz.model_dump(), indent=2)