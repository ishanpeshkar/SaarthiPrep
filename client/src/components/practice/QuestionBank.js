import React, { useState, useMemo } from 'react';
import './PracticeComponents.css';

const allQuestions = [
  { id: 1, title: 'Contains Duplicate', difficulty: 'Easy', topic: 'Arrays & Hashing' },
  { id: 2, title: 'Valid Anagram', difficulty: 'Easy', topic: 'Arrays & Hashing' },
  { id: 3, title: 'Two Sum', difficulty: 'Easy', topic: 'Arrays & Hashing' },
  { id: 4, title: 'Valid Palindrome', difficulty: 'Easy', topic: 'Two Pointers' },
  { id: 5, title: 'Valid Parentheses', difficulty: 'Easy', topic: 'Stack' },
  { id: 6, title: 'Group Anagrams', difficulty: 'Medium', topic: 'Arrays & Hashing' },
  { id: 7, title: '3Sum', difficulty: 'Medium', topic: 'Two Pointers' },
  { id: 8, title: 'Longest Consecutive Sequence', difficulty: 'Medium', topic: 'Arrays & Hashing' },
  { id: 9, title: 'Min Stack', difficulty: 'Medium', topic: 'Stack' },
  { id: 10, title: 'Find Minimum in Rotated Sorted Array', difficulty: 'Medium', topic: 'Binary Search' },
  { id: 11, 'title': 'Reverse Linked List', difficulty: 'Easy', topic: 'Linked List' },
];

const QuestionBank = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');

  const filteredQuestions = useMemo(() => {
    return allQuestions.filter(q => {
      const matchesDifficulty = difficultyFilter === 'All' || q.difficulty === difficultyFilter;
      const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDifficulty && matchesSearch;
    });
  }, [searchTerm, difficultyFilter]);

  return (
    <div className="practice-card">
      <h3>Question Bank</h3>
      <div className="question-bank-filters">
        <input 
          type="text" 
          placeholder="Search questions..." 
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select onChange={(e) => setDifficultyFilter(e.target.value)}>
          <option>All</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
      </div>
      <ul className="question-list">
        {filteredQuestions.map(q => (
          <li key={q.id} className="question-item">
            <span>{q.title}</span>
            <span className={`difficulty-tag ${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionBank;