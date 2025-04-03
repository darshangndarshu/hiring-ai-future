
import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Message {
  id: string;
  sender: 'ai' | 'user';
  content: string;
  time: Date;
}

const InterviewInterface = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questions = [
    "Could you tell me about your previous work experience and how it relates to this position?",
    "What are your key strengths in frontend development?",
    "Describe a challenging technical problem you faced and how you resolved it.",
    "How do you stay updated with the latest trends and technologies in your field?",
    "Why are you interested in joining our company specifically?"
  ];

  useEffect(() => {
    // Add initial AI message
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          sender: 'ai',
          content: "Hello! I'm your AI interviewer today. I'll be asking you a series of questions to learn more about your skills and experience. Let's start with the first question.",
          time: new Date()
        },
        {
          id: '2',
          sender: 'ai',
          content: questions[0],
          time: new Date(Date.now() + 1000)
        }
      ]);
    }
  }, []);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleCamera = async () => {
    if (isCameraOn) {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraOn(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraOn(true);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    }
  };

  const toggleMicrophone = () => {
    setIsRecording(!isRecording);
    
    if (!isRecording && currentQuestion < questions.length - 1) {
      // Simulate user response after a short delay
      setTimeout(() => {
        const userResponse = "This is a simulated user response to the question.";
        
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: 'user',
            content: userResponse,
            time: new Date()
          }
        ]);
        
        // Simulate AI follow-up after user response
        setTimeout(() => {
          const nextQuestion = questions[currentQuestion + 1];
          setCurrentQuestion(currentQuestion + 1);
          
          setMessages(prev => [
            ...prev,
            {
              id: Date.now().toString() + '-ai',
              sender: 'ai',
              content: "Thank you for your answer. Let's move on to the next question.",
              time: new Date()
            },
            {
              id: Date.now().toString() + '-ai-q',
              sender: 'ai',
              content: nextQuestion,
              time: new Date(Date.now() + 100)
            }
          ]);
        }, 1500);
      }, 3000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      <Card className="lg:col-span-2 flex flex-col">
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">AI Interview</h2>
              <p className="text-sm text-muted-foreground">Frontend Developer Position</p>
            </div>
            <Badge className="bg-amber-100 text-amber-800 px-3 py-1">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
          </div>
          
          <div className="flex-grow relative">
            <div className="video-container aspect-video bg-muted">
              {isCameraOn ? (
                <video 
                  ref={videoRef} 
                  autoPlay 
                  muted 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <VideoOff className="mx-auto h-12 w-12 mb-2" />
                    <p>Camera is turned off</p>
                    <Button 
                      onClick={toggleCamera} 
                      variant="outline" 
                      className="mt-4"
                    >
                      Turn on camera
                    </Button>
                  </div>
                </div>
              )}
              
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center space-x-2 bg-black/50 text-white px-3 py-1 rounded-full">
                  <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse-slow"></div>
                  <span className="text-sm">Recording</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-4 flex space-x-4 justify-center">
            <Button 
              onClick={toggleMicrophone} 
              variant={isRecording ? "default" : "outline"}
              size="lg"
              className={`rounded-full h-12 w-12 p-0 ${isRecording ? 'bg-red-500 hover:bg-red-600' : ''}`}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
            
            <Button 
              onClick={toggleCamera} 
              variant={isCameraOn ? "default" : "outline"}
              size="lg"
              className={`rounded-full h-12 w-12 p-0 ${isCameraOn ? 'bg-primary hover:bg-primary/90' : ''}`}
            >
              {isCameraOn ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="flex flex-col">
        <CardContent className="p-4 flex-grow flex flex-col">
          <div className="mb-4">
            <h3 className="font-semibold flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Interview Conversation
            </h3>
          </div>
          
          <div className="flex-grow bg-muted/30 rounded-md p-4 overflow-y-auto max-h-[400px]">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === 'ai' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex max-w-[80%] ${message.sender === 'ai' ? 'flex-row' : 'flex-row-reverse'}`}>
                    {message.sender === 'ai' && (
                      <div className="mr-2 mt-1">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary text-white text-xs">AI</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    
                    <div className={`rounded-lg px-4 py-2 ${
                      message.sender === 'ai' 
                        ? 'bg-muted text-foreground' 
                        : 'bg-primary text-primary-foreground'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="ml-2 mt-1">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-accent text-accent-foreground text-xs">ME</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <div className="mt-4">
            <Button className="w-full" disabled={!isRecording}>
              {isRecording ? "Recording your answer..." : "Click microphone to answer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewInterface;
