# Timer App

## Project Overview

This is a React Native application designed to manage and track various timers. The app allows users to create, manage, and visualize timers for different activities like workouts, study sessions, breaks, and more. It supports timer grouping by category, bulk actions, progress visualization, and user feedback when timers are completed.

## Setup Instructions
To set up the project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/timer-app.git
   cd Timer_Application
   ```

2. **Install dependencies:**
   Make sure you have [Node.js](https://nodejs.org/) installed. Then, run:
   ```bash
   npm install
   ```

3. **Run the application:**
   Start the development server with:
   ```bash
   npm start
   ```
   This command will start the application, and you can view it in your browser or simulator.

4. **Run on mobile devices:**
   - For **iOS**: Run `npx react-native run-ios`
   - For **Android**: Run `npx react-native run-android`

5. **Make sure to install required native dependencies (if any)** as mentioned in the documentation of each library used in the project.

## Core Features

### 1. Add Timer
- **Name**: Enter the name of the timer (e.g., "Workout Timer").
- **Duration**: Set the duration of the timer in seconds.
- **Category**: Assign a category to the timer (e.g., "Workout," "Study," "Break").
- The timer is saved to a list and persisted locally using `AsyncStorage` for offline usage.

### 2. Timer List with Grouping
- All timers are grouped by their categories (e.g., "Workout," "Study").
- Categories can be expanded or collapsed to show/hide the timers within them.
- For each timer, the following information is displayed:
  - **Name**
  - **Remaining time**
  - **Status**: Running, Paused, or Completed.

### 3. Timer Management
- **Start**: Begin the countdown for the selected timer.
- **Pause**: Pause the countdown for the selected timer.
- **Reset**: Reset the timer back to its original duration.
- **Complete**: When a timer reaches zero, it is marked as "Completed."

### 4. Progress Visualization
- A progress bar or percentage is displayed for each timer to visually indicate the remaining time in comparison to the total duration.

### 5. Bulk Actions
- At the category level, users can perform the following bulk actions for all timers in that category:
  - **Start all timers**
  - **Pause all timers**
  - **Reset all timers**

### 6. User Feedback
- When a timer completes, an on-screen modal will display a congratulatory message with the timer’s name, letting the user know they’ve completed the task.

## Technologies and Libraries Used
- **React Native**: For building the mobile application.
- **Context API**: For managing themes across components.
- **React Navigation**: For navigating between screens.
- **Typescript**: As the primary programming language.

## Known Limitations
- Limited error handling and validation messages.
- No user authentication or account management features.
## Live Demo
You can test the application by visiting the following link:

[Live Demo](https://drive.google.com/file/d/1_3WehSnsJUjhY8vIEzKDCsz_JRnMrwt2/view?usp=sharing)
