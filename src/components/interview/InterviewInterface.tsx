
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Check, MicOff, Mic, Video, VideoOff, Clock, User, Bot, Send, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const InterviewInterface = () => {
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [interviewProgress, setInterviewProgress] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(120);
  const [isThinking, setIsThinking] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    "Tell me about your experience with React and other frontend technologies.",
    "How do you approach debugging a complex issue in a web application?",
    "Can you describe a challenging project you worked on and how you overcame obstacles?",
    "How do you stay updated with the latest trends in web development?",
    "What's your experience with state management in React applications?",
    "How do you approach testing in your projects?",
    "Describe your ideal team environment and work culture.",
    "Where do you see yourself professionally in the next 3-5 years?"
  ];

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (interviewStarted && !interviewComplete) {
      // Add first question after interview starts
      if (messages.length === 0) {
        addAIMessage(questions[0]);
      }
    }
  }, [interviewStarted, interviewComplete, messages.length]);

  // Initialize camera when video is turned on
  useEffect(() => {
    if (isVideoOn && videoRef.current) {
      initializeCamera();
    } else if (!isVideoOn && videoRef.current) {
      stopCamera();
    }
  }, [isVideoOn]);

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: false 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
      setIsVideoOn(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setIsMicOn(true);
    setIsVideoOn(true);
    setMessages([]);
    setInterviewProgress(0);
    setCurrentQuestionIndex(0);
    // The first question will be added by the useEffect
  };

  const endInterview = () => {
    setInterviewComplete(true);
    setIsMicOn(false);
    setIsVideoOn(false);
    stopCamera();
    
    // Add a final message
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: "Thank you for completing the interview! We'll review your responses and get back to you shortly.",
        timestamp: new Date()
      }
    ]);
  };

  const resetInterview = () => {
    setInterviewStarted(false);
    setInterviewComplete(false);
    setCurrentQuestionIndex(0);
    setInterviewProgress(0);
    setMessages([]);
    setCurrentAnswer('');
    setIsMicOn(false);
    setIsVideoOn(false);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const addAIMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content,
        timestamp: new Date()
      }
    ]);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        content,
        timestamp: new Date()
      }
    ]);
  };

  const submitAnswer = () => {
    if (!currentAnswer.trim()) return;
    
    // Add user's answer to messages
    addUserMessage(currentAnswer);
    setCurrentAnswer('');
    
    // AI is thinking
    setIsThinking(true);
    
    // Move to next question after a delay
    setTimeout(() => {
      setCurrentQuestionIndex(prevIndex => {
        const newIndex = prevIndex + 1;
        setInterviewProgress(Math.round((newIndex / questions.length) * 100));
        
        if (newIndex < questions.length) {
          // Add next question
          addAIMessage(questions[newIndex]);
        } else {
          // End interview if all questions are answered
          endInterview();
        }
        
        return newIndex;
      });
      
      setIsThinking(false);
    }, 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitAnswer();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card className="w-full h-full flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <span>AI Interview Session</span>
              {interviewStarted && !interviewComplete && (
                <div className="flex items-center text-sm font-normal">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                </div>
              )}
            </CardTitle>
            {interviewStarted && !interviewComplete && (
              <div className="space-y-1 pt-2">
                <div className="flex justify-between text-sm">
                  <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
                  <span>{interviewProgress}% complete</span>
                </div>
                <Progress value={interviewProgress} className="h-2" />
              </div>
            )}
          </CardHeader>
          
          <CardContent className="flex-grow overflow-y-auto">
            {!interviewStarted && !interviewComplete ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="mb-6">
                  <div className="bg-primary/10 rounded-full p-4 inline-block mb-3">
                    <Bot className="h-10 w-10 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold mb-2">Start Your AI Interview</h2>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    This interview will be conducted by our AI assistant and will include questions about your skills, experience, and approach to software development.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto mb-6">
                    <div className="flex items-start p-3 bg-muted/30 rounded-lg">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">8 Questions</p>
                        <p className="text-xs text-muted-foreground">Technical and behavioral evaluation</p>
                      </div>
                    </div>
                    <div className="flex items-start p-3 bg-muted/30 rounded-lg">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">~20 Minutes</p>
                        <p className="text-xs text-muted-foreground">Estimated completion time</p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={startInterview} 
                    className="min-w-[150px]"
                    size="lg"
                  >
                    Start Interview
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 pb-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <Avatar className={`h-8 w-8 ${message.role === 'user' ? 'bg-primary' : 'bg-muted'}`}>
                        {message.role === 'assistant' ? (
                          <Bot className="h-5 w-5" />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                        <AvatarFallback>
                          {message.role === 'assistant' ? 'AI' : 'You'}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`rounded-lg p-3 text-sm ${
                        message.role === 'assistant' 
                          ? 'bg-muted' 
                          : 'bg-primary text-primary-foreground'
                      }`}>
                        <p>{message.content}</p>
                        <div className={`text-xs mt-1 ${
                          message.role === 'assistant' 
                            ? 'text-muted-foreground' 
                            : 'text-primary-foreground/80'
                        }`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isThinking && (
                  <div className="flex justify-start">
                    <div className="flex gap-3 max-w-[80%]">
                      <Avatar className="h-8 w-8 bg-muted">
                        <Bot className="h-5 w-5" />
                        <AvatarFallback>AI</AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg p-3 text-sm min-w-[60px]">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce"></div>
                          <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                          <div className="h-2 w-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </CardContent>
          
          {interviewStarted && !interviewComplete && (
            <CardFooter className="border-t bg-card pt-3">
              <div className="flex w-full gap-2">
                <Textarea
                  placeholder="Type your answer here..."
                  value={currentAnswer}
                  onChange={(e) => setCurrentAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow min-h-[80px]"
                  disabled={isThinking || currentQuestionIndex >= questions.length}
                />
                <Button 
                  className="self-end"
                  onClick={submitAnswer}
                  disabled={isThinking || !currentAnswer.trim() || currentQuestionIndex >= questions.length}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          )}
          
          {interviewComplete && (
            <CardFooter className="border-t pt-3 flex justify-end">
              <Button onClick={resetInterview}>
                Start New Interview
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      
      <div className="lg:col-span-1">
        <Card className="w-full h-full">
          <CardHeader>
            <CardTitle>Candidate View</CardTitle>
            <CardDescription>
              Your camera and microphone feeds
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              {isVideoOn ? (
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <User className="h-16 w-16 text-muted-foreground opacity-50" />
                </div>
              )}
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button 
                variant={isMicOn ? "default" : "outline"} 
                size="icon"
                onClick={toggleMic}
                className="rounded-full h-12 w-12"
                disabled={!interviewStarted || interviewComplete}
              >
                {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
              </Button>
              <Button 
                variant={isVideoOn ? "default" : "outline"} 
                size="icon"
                onClick={toggleVideo}
                className="rounded-full h-12 w-12"
                disabled={!interviewStarted || interviewComplete}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
            </div>
            
            {interviewStarted && !interviewComplete && (
              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-medium mb-2">Tips for your interview</h3>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <ArrowRight className="h-3 w-3 mr-2 mt-1 flex-shrink-0" />
                      Speak clearly and at a moderate pace
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-3 w-3 mr-2 mt-1 flex-shrink-0" />
                      Give specific examples from your experience
                    </li>
                    <li className="flex items-start">
                      <ArrowRight className="h-3 w-3 mr-2 mt-1 flex-shrink-0" />
                      Keep your answers focused and relevant
                    </li>
                  </ul>
                </div>
                
                {currentQuestionIndex < questions.length && (
                  <div className="p-4 border rounded-lg bg-yellow-50 border-yellow-200">
                    <h3 className="font-medium text-yellow-800 mb-1">Current Question</h3>
                    <p className="text-sm text-yellow-800">{questions[currentQuestionIndex]}</p>
                  </div>
                )}
                
                {interviewStarted && !interviewComplete && (
                  <Button 
                    variant="outline" 
                    className="w-full border-destructive text-destructive hover:bg-destructive/10"
                    onClick={endInterview}
                  >
                    End Interview Early
                  </Button>
                )}
              </div>
            )}
            
            {interviewComplete && (
              <Tabs defaultValue="results">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="results">Results</TabsTrigger>
                  <TabsTrigger value="feedback">Feedback</TabsTrigger>
                </TabsList>
                
                <TabsContent value="results" className="space-y-4">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <h3 className="font-medium text-emerald-800 mb-2">Interview Complete</h3>
                    <p className="text-sm text-emerald-700 mb-3">
                      You've successfully completed the AI interview!
                    </p>
                    <div className="bg-white rounded-md p-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overall Score</span>
                        <span className="font-bold">87%</span>
                      </div>
                      <Progress value={87} className="h-2 mt-1" />
                    </div>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">Score Breakdown</h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Technical Knowledge</span>
                          <span>92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Communication Skills</span>
                          <span>85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Problem Solving</span>
                          <span>90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Cultural Fit</span>
                          <span>82%</span>
                        </div>
                        <Progress value={82} className="h-2" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="feedback" className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">Strengths</h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                        Strong technical expertise in React and frontend development
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                        Clear communication and well-structured answers
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-emerald-600 mr-2 mt-0.5 flex-shrink-0" />
                        Good problem-solving approach with practical examples
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">Areas for Improvement</h3>
                    <ul className="text-sm space-y-2">
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        Could provide more specific metrics and outcomes
                      </li>
                      <li className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-amber-600 mr-2 mt-0.5 flex-shrink-0" />
                        Consider expanding knowledge of backend technologies
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">Next Steps</h3>
                    <p className="text-sm">
                      Your interview results have been sent to the hiring team. You should receive feedback within 3-5 business days.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewInterface;
