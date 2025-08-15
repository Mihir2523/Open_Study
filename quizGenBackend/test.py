import sys
from pathlib import Path
from utils.text_extraction import FileTextExtractor
from utils.quiz_gen import QuizGenerator


def main():
    if len(sys.argv) != 2:
        print("Usage: python test_file_to_quiz.py <file_path>")
        sys.exit(1)

    file_path = Path(sys.argv[1])

    if not file_path.exists():
        print(f"Error: File '{file_path}' does not exist.")
        sys.exit(1)

    try:
        # 1. Extract text from file
        text = FileTextExtractor.extract_text(str(file_path))
        if not text.strip():
            print("[No text found in document]")
            return

        print("\n=== Extracted Text ===\n")
        print(text[:500] + ("..." if len(text) > 500 else ""))  # Preview only

        # 2. Initialize quiz generator
        quiz_gen = QuizGenerator()

        # 3. Generate quiz JSON from extracted text
        quiz_json = quiz_gen.generate_as_json(
            text=text,
            count=5,
            qtype="mcq",
            difficulty="medium",
            option_count=4
        )

        # 4. Print quiz output
        print("\n=== Generated Quiz ===\n")
        print(quiz_json)

    except Exception as e:
        print(f"Error: {e}")


if __name__ == "__main__":
    main()