
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Brain, Code, PenTool, Timer, CheckCircle, ArrowRight, BookOpen, BrainCircuit } from "lucide-react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string | string[];
  type: 'single' | 'multiple';
  explanation?: string;
}

const technicalQuestions: Question[] = [
  {
    id: 't1',
    question: 'Which of the following is a declarative JavaScript library for building user interfaces?',
    options: ['Angular', 'React', 'Vue', 'jQuery'],
    correctAnswer: 'React',
    type: 'single',
    explanation: 'React is a declarative JavaScript library developed by Facebook for building user interfaces.'
  },
  {
    id: 't2',
    question: 'Which of the following are JavaScript frameworks or libraries?',
    options: ['React', 'Python', 'Angular', 'Java'],
    correctAnswer: ['React', 'Angular'],
    type: 'multiple',
    explanation: 'React and Angular are JavaScript frameworks/libraries, while Python and Java are separate programming languages.'
  },
  {
    id: 't3',
    question: 'What does API stand for?',
    options: ['Application Programming Interface', 'Automated Programming Interface', 'Application Process Integration', 'Advanced Programming Interface'],
    correctAnswer: 'Application Programming Interface',
    type: 'single',
    explanation: 'API stands for Application Programming Interface, which defines interactions between multiple software applications.'
  },
];

const behavioralQuestions: Question[] = [
  {
    id: 'b1',
    question: 'When working on a team project with a tight deadline, which approach would you prioritize?',
    options: [
      'Working independently to maximize efficiency', 
      'Regular communication with team members even if it takes time',
      'Focusing solely on your assigned tasks',
      'Taking on additional responsibilities to ensure project completion'
    ],
    correctAnswer: 'Regular communication with team members even if it takes time',
    type: 'single'
  },
  {
    id: 'b2',
    question: 'Which of these qualities are most important for effective teamwork?',
    options: ['Communication', 'Independence', 'Technical expertise', 'Leadership'],
    correctAnswer: ['Communication', 'Leadership'],
    type: 'multiple'
  },
  {
    id: 'b3',
    question: 'How do you typically respond to constructive criticism?',
    options: [
      'I take it personally and get defensive',
      'I listen carefully and consider how to improve',
      'I ignore it if I disagree',
      'I immediately try to implement all suggestions'
    ],
    correctAnswer: 'I listen carefully and consider how to improve',
    type: 'single'
  }
];

const SkillAssessment = () => {
  const [assessmentStarted, setAssessmentStarted] = useState(false);
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [currentSection, setCurrentSection] = useState<'technical' | 'behavioral'>('technical');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [score, setScore] = useState({ technical: 0, behavioral: 0 });

  const questions = currentSection === 'technical' ? technicalQuestions : behavioralQuestions;
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = assessmentComplete 
    ? 100 
    : (((currentSection === 'technical' ? 0 : technicalQuestions.length) + currentQuestionIndex) / 
       (technicalQuestions.length + behavioralQuestions.length)) * 100;

  const startAssessment = () => {
    setAssessmentStarted(true);
    setCurrentSection('technical');
    setCurrentQuestionIndex(0);
    setAnswers({});
    setSelectedOptions([]);
    // In a real app, you would start a timer here
  };

  const handleSelectOption = (option: string) => {
    if (currentQuestion.type === 'single') {
      setSelectedOptions([option]);
    } else {
      // For multiple choice
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter(item => item !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    }
  };

  const handleNextQuestion = () => {
    // Save the current answer
    setAnswers({
      ...answers,
      [currentQuestion.id]: selectedOptions.length === 1 && currentQuestion.type === 'single' 
        ? selectedOptions[0] 
        : selectedOptions
    });
    
    // Reset selected options
    setSelectedOptions([]);
    
    // Move to next question or section
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSection === 'technical') {
      setCurrentSection('behavioral');
      setCurrentQuestionIndex(0);
    } else {
      completeAssessment();
    }
  };

  const completeAssessment = () => {
    // Calculate scores
    let technicalScore = 0;
    let behavioralScore = 0;
    
    technicalQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      if (question.type === 'single' && userAnswer === question.correctAnswer) {
        technicalScore++;
      } else if (question.type === 'multiple') {
        // For multiple choice, check if arrays contain the same elements
        const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        const correctAnswerArray = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
        
        if (
          userAnswerArray.length === correctAnswerArray.length &&
          userAnswerArray.every(item => correctAnswerArray.includes(item))
        ) {
          technicalScore++;
        }
      }
    });
    
    behavioralQuestions.forEach(question => {
      const userAnswer = answers[question.id];
      if (question.type === 'single' && userAnswer === question.correctAnswer) {
        behavioralScore++;
      } else if (question.type === 'multiple') {
        // Same logic as above
        const userAnswerArray = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
        const correctAnswerArray = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
        
        if (
          userAnswerArray.length === correctAnswerArray.length &&
          userAnswerArray.every(item => correctAnswerArray.includes(item))
        ) {
          behavioralScore++;
        }
      }
    });
    
    setScore({
      technical: Math.round((technicalScore / technicalQuestions.length) * 100),
      behavioral: Math.round((behavioralScore / behavioralQuestions.length) * 100)
    });
    
    setAssessmentComplete(true);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BrainCircuit className="mr-2 h-5 w-5" />
          Skill Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!assessmentStarted && !assessmentComplete ? (
          <div className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-2">Software Developer Assessment</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This assessment will evaluate your technical knowledge and behavioral skills for the Software Developer position.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Code className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Technical Skills</h4>
                    <p className="text-sm text-muted-foreground">
                      Questions about programming concepts and software development
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Behavioral Skills</h4>
                    <p className="text-sm text-muted-foreground">
                      Questions to assess teamwork, communication, and problem-solving
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Timer className="h-4 w-4 mr-2" />
                  <span>Time Limit: 5 minutes</span>
                </div>
                <div className="flex items-center text-sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>Questions: {technicalQuestions.length + behavioralQuestions.length}</span>
                </div>
              </div>
              
              <Button onClick={startAssessment} className="w-full">
                Start Assessment
              </Button>
            </div>
          </div>
        ) : assessmentStarted && !assessmentComplete ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <Badge variant="outline" className="flex items-center">
                {currentSection === 'technical' ? (
                  <>
                    <Code className="h-4 w-4 mr-1" />
                    Technical
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-1" />
                    Behavioral
                  </>
                )}
              </Badge>
              
              <div className="flex items-center text-sm">
                <Timer className="h-4 w-4 mr-1" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                <span>{Math.round(progressPercentage)}% Complete</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
            
            <div className="bg-muted/20 rounded-lg p-6">
              <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
              
              {currentQuestion.type === 'single' ? (
                <RadioGroup 
                  value={selectedOptions[0]} 
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <RadioGroupItem 
                        value={option} 
                        id={`option-${index}`} 
                        checked={selectedOptions.includes(option)}
                        onClick={() => handleSelectOption(option)}
                      />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`option-${index}`} 
                        checked={selectedOptions.includes(option)}
                        onCheckedChange={() => handleSelectOption(option)}
                      />
                      <Label htmlFor={`option-${index}`} className="cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-emerald-100 p-2 rounded-full">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-medium text-emerald-800">Assessment Complete!</h3>
                  <p className="text-sm text-emerald-700">You've successfully completed the skill assessment</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Technical Skills</span>
                    <span className="text-sm font-medium">{score.technical}%</span>
                  </div>
                  <Progress value={score.technical} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Behavioral Skills</span>
                    <span className="text-sm font-medium">{score.behavioral}%</span>
                  </div>
                  <Progress value={score.behavioral} className="h-2" />
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className="text-sm font-medium">{Math.round((score.technical + score.behavioral) / 2)}%</span>
                  </div>
                  <Progress value={Math.round((score.technical + score.behavioral) / 2)} className="h-2" />
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="results">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              
              <TabsContent value="results" className="space-y-4">
                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Skill Areas</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">Technical Strengths</h4>
                      <ul className="text-sm space-y-1 ml-4 list-disc">
                        <li>React Development</li>
                        <li>API Integration</li>
                        <li>JavaScript Fundamentals</li>
                      </ul>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3">
                      <h4 className="text-sm font-medium mb-2">Areas for Improvement</h4>
                      <ul className="text-sm space-y-1 ml-4 list-disc">
                        <li>Database Design</li>
                        <li>Testing Methodologies</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Behavioral Assessment</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Teamwork</span>
                      <Progress value={85} className="w-1/2 h-2" />
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Communication</span>
                      <Progress value={90} className="w-1/2 h-2" />
                      <span className="text-sm font-medium">90%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Problem-solving</span>
                      <Progress value={75} className="w-1/2 h-2" />
                      <span className="text-sm font-medium">75%</span>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="recommendations" className="space-y-4">
                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Career Development</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <span className="text-sm">Consider taking an advanced course in database design and optimization</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <span className="text-sm">Join a local developer community to improve collaboration skills</span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-5 w-5 flex items-center justify-center mr-2">•</div>
                      <span className="text-sm">Explore TDD (Test-Driven Development) methodologies</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-muted/20 rounded-lg p-4">
                  <h3 className="font-medium mb-3">Job Matches</h3>
                  <div className="space-y-3">
                    <div className="bg-muted/30 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium">Frontend Developer</h4>
                        <p className="text-xs text-muted-foreground">92% match</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Openings
                      </Button>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium">React Developer</h4>
                        <p className="text-xs text-muted-foreground">88% match</p>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        View Openings
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
      
      {assessmentStarted && !assessmentComplete && (
        <CardFooter>
          <Button 
            className="w-full"
            onClick={handleNextQuestion}
            disabled={selectedOptions.length === 0}
          >
            {currentSection === 'behavioral' && currentQuestionIndex === questions.length - 1 
              ? 'Complete Assessment' 
              : 'Next Question'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      )}
      
      {assessmentComplete && (
        <CardFooter>
          <Button 
            variant="outline"
            className="w-full"
            onClick={startAssessment}
          >
            Retake Assessment
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SkillAssessment;
