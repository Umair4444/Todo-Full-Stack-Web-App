// About page
import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-4">{"About TodoApp"}</h1>
        <p className="text-lg text-muted-foreground">
          {"Learn more about our mission and vision"}
        </p>
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{"Our Story"}</h2>
        <p className="text-muted-foreground mb-4">
          {"TodoApp was created with the vision of helping people organize their lives and increase productivity "}
          {"through a simple, intuitive, and beautiful interface. We believe that everyone deserves a tool that "}
          {"makes task management effortless and enjoyable."}
        </p>
        <p className="text-muted-foreground">
          {"Our team is passionate about creating software that genuinely improves people's daily lives. "}
          {"We constantly strive to enhance our application based on user feedback and the latest technology trends."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-card rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-3">{"Our Mission"}</h3>
          <p className="text-muted-foreground">
            {"To provide a seamless, intuitive task management experience that helps individuals and teams "}
            {"stay organized, focused, and productive."}
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-sm border p-6">
          <h3 className="text-xl font-semibold mb-3">{"Our Vision"}</h3>
          <p className="text-muted-foreground">
            {"To become the go-to productivity tool for millions of users worldwide, "}
            {"empowering them to achieve their personal and professional goals."}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{"Features"}</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-muted-foreground">
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{"Intuitive task management"}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{"Dark/Light mode support"}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{"Multilingual support (English & Urdu)"}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{"Prioritization and filtering"}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{"Responsive design"}</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2 text-green-500">✓</span>
            <span>{"Floating chatbot assistant"}</span>
          </li>
        </ul>
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">{"Our Team"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold">{"Alex Johnson"}</h3>
            <p className="text-sm text-muted-foreground">{"Frontend Developer"}</p>
          </div>
          <div className="text-center">
            <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold">{"Maria Garcia"}</h3>
            <p className="text-sm text-muted-foreground">{"UI/UX Designer"}</p>
          </div>
          <div className="text-center">
            <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
            <h3 className="font-semibold">{"Samuel Chen"}</h3>
            <p className="text-sm text-muted-foreground">{"Backend Developer"}</p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border p-6">
        <h2 className="text-2xl font-semibold mb-4">{"About Our Company"}</h2>
        <p className="text-muted-foreground mb-4">
          {"TodoApp was founded in 2026 with the mission to simplify task management for individuals and teams worldwide. "}
          {"Our company is built on the principles of innovation, user-centric design, and accessibility."}
        </p>
        <p className="text-muted-foreground">
          {"We believe that everyone deserves tools that make their lives easier and more productive. "}
          {"Our team works tirelessly to ensure our application meets the diverse needs of our global user base, "}
          {"supporting multiple languages and accessibility standards."}
        </p>
      </div>
    </div>
  );
};

export default AboutPage;