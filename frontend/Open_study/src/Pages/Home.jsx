import { useState } from 'react';

const QuizPlatform = () => {
  const [isManual, setIsManual] = useState(true);
  const [manualQuiz, setManualQuiz] = useState({
    title: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: ''
  });
  const [autoQuiz, setAutoQuiz] = useState({
    title: '',
    topic: '',
    numQuestions: 5
  });
  const [questions, setQuestions] = useState([]);

  const handleManualChange = (e, index = null) => {
    if (index !== null) {
      const newOptions = [...manualQuiz.options];
      newOptions[index] = e.target.value;
      setManualQuiz({ ...manualQuiz, options: newOptions });
    } else {
      setManualQuiz({ ...manualQuiz, [e.target.id]: e.target.value });
    }
  };

  const handleAutoChange = (e) => {
    setAutoQuiz({ ...autoQuiz, [e.target.id]: e.target.value });
  };

  const addQuestion = () => {
    const { question, options, correctAnswer } = manualQuiz;
    if (question && options.every(opt => opt) && correctAnswer) {
      setQuestions([...questions, { question, options, correctAnswer }]);
      setManualQuiz({ ...manualQuiz, question: '', options: ['', '', '', ''], correctAnswer: '' });
    } else {
      alert('Please fill in all fields.');
    }
  };

  const saveManualQuiz = (e) => {
    e.preventDefault();
    if (manualQuiz.title && questions.length > 0) {
      alert('Manual Quiz saved successfully!');
      console.log({ title: manualQuiz.title, questions });
      setQuestions([]);
    } else {
      alert('Please add a title and at least one question.');
    }
  };

  const generateAutoQuiz = (e) => {
    e.preventDefault();
    alert('Auto-Generate functionality is currently disabled.');
  };

  return (
    <div className="bg-gray-100 font-sans min-h-screen">
      <header className="bg-blue-600 text-white p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">QuizMaster</h1>
          <div>
            <a href="#home" className="px-4 hover:underline">Home</a>
            <a href="#quiz-generator" className="px-4 hover:underline">Create Quiz</a>
            <a href="#" className="px-4 hover:underline">About</a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto p-4" id="quiz-generator">
        <h2 className="text-3xl font-bold text-center mb-6">Create Your Quiz</h2>
        <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
          <div className="flex justify-between mb-4">
            <button onClick={() => setIsManual(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Manual Quiz</button>
            <button onClick={() => setIsManual(false)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Generate Quiz</button>
            <button onClick={() => setIsManual(false)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Auto-Generate Quiz</button>
          </div>

          {isManual ? (
            <form onSubmit={saveManualQuiz}>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Quiz Title</label>
                <input type="text" id="title" value={manualQuiz.title} onChange={handleManualChange} className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Question</label>
                <input type="text" id="question" value={manualQuiz.question} onChange={handleManualChange} className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Answer Options</label>
                {manualQuiz.options.map((opt, i) => (
                  <input key={i} type="text" value={opt} onChange={(e) => handleManualChange(e, i)} className="w-full p-2 border rounded mb-2" required />
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Correct Answer</label>
                <select id="correctAnswer" value={manualQuiz.correctAnswer} onChange={(e) => setManualQuiz({ ...manualQuiz, correctAnswer: e.target.value })} className="w-full p-2 border rounded" required>
                  <option value="">Select correct option</option>
                  <option value="1">Option 1</option>
                  <option value="2">Option 2</option>
                  <option value="3">Option 3</option>
                  <option value="4">Option 4</option>
                </select>
              </div>
              <button type="button" onClick={addQuestion} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-2">Add Question</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Save Quiz</button>
            </form>
          ) : (
            <form onSubmit={generateAutoQuiz}>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Quiz Title</label>
                <input type="text" id="title" value={autoQuiz.title} onChange={handleAutoChange} className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Quiz Topic</label>
                <input type="text" id="topic" value={autoQuiz.topic} onChange={handleAutoChange} className="w-full p-2 border rounded" required />
              </div>
              <div className="mb-4">
                <label className="block text-lg font-medium mb-2">Number of Questions</label>
                <input type="number" id="numQuestions" value={autoQuiz.numQuestions} onChange={handleAutoChange} min="1" max="10" className="w-full p-2 border rounded" required />
              </div>
              <p className="text-red-600 mb-2">Auto-generation is currently disabled.</p>
              <button type="submit" className="bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed" disabled>Generate Quiz</button>
            </form>
          )}

          <div id="question-list" className="mt-6">
            <h3 className="text-lg font-medium">Added Questions</h3>
            <ul className="list-disc pl-5">
              {questions.map((q, i) => (
                <li key={i}>{q.question} (Correct: Option {q.correctAnswer})</li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <footer className="bg-gray-800 text-white text-center p-4">
        <p>© 2025 QuizMaster. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default QuizPlatform;
