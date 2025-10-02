# Syntax Sentry

**AI-Powered Code Analysis and Activity Tracking Platform**

Syntax Sentry is an advanced Chrome extension and web platform designed to detect and analyze potential cheating behaviors in coding assessments, particularly on platforms like LeetCode. By tracking user activity, code modifications, and behavioral patterns, it ensures fair competition and maintains academic integrity.

## 🚀 Features

### Core Functionality
- **Real-time Activity Monitoring**: Tracks user interactions including keystrokes, copy/paste events, tab switches, and code submissions
- **AI-Powered Analysis**: Advanced machine learning models detect suspicious patterns and AI-generated code
- **Behavioral Pattern Detection**: Analyzes typing patterns, timing intervals, and user behavior to identify potential cheating
- **Multi-Platform Support**: Currently optimized for LeetCode with extensible architecture for other coding platforms

### Dashboard Features
- **Activity Dashboard**: Comprehensive view of all user activities with filtering and search capabilities
- **Grouped View**: Organize activities by username and problem for better analysis
- **Real-time Updates**: Live monitoring of user activities and AI analysis results
- **Suspicion Scoring**: AI-generated suspicion scores with detailed breakdowns
- **Room Management**: Create and manage activity monitoring rooms for group assessments

### AI Analysis Capabilities
- **Copy/Paste Detection**: Identifies rapid copy-paste behaviors and analyzes copied content
- **Keystroke Analysis**: Detects unnatural typing patterns and timing anomalies
- **Tab Activity Monitoring**: Tracks focus changes and time spent away from coding environment
- **Code Generation Detection**: Identifies AI-generated code with confidence percentages
- **Behavioral Scoring**: Comprehensive scoring system based on multiple suspicious factors

## 🏗️ Architecture

### Frontend (Next.js)
- **Framework**: Next.js 14 with TypeScript
- **UI Components**: Custom components built with Radix UI and Tailwind CSS
- **State Management**: React hooks and context for state management
- **Animations**: Framer Motion for smooth user interactions
- **Theme Support**: Dark/light mode with system preference detection

### Backend (Next.js API Routes)
- **API Endpoints**: RESTful API for activity logging and data retrieval
- **Database Integration**: MongoDB with Mongoose ODM
- **Real-time Processing**: Asynchronous AI analysis triggering
- **CORS Support**: Cross-origin resource sharing for Chrome extension integration

### AI Analysis Engine (Python)
- **Key Analysis** (`keymain.py`): Analyzes keystroke patterns and timing
- **Copy Analysis** (`copymain.py`): Detects and analyzes copy operations
- **Paste Analysis** (`paste.py`): Evaluates pasted content for suspicious patterns
- **Tab Analysis** (`tab.py`): Monitors tab switching and focus behavior

### Database Schema
- **Activities Collection**: Stores user interaction events with detailed metadata
- **AI Responses Collection**: Stores AI analysis results and suspicion scores
- **Rooms Collection**: Manages group monitoring sessions

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account
- Python 3.8+ (for AI analysis scripts)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/officialSyntaxSentry/extension-web.git
   cd extension-web
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   BASE_URL=http://localhost:3000
   FASTAPI_URL=your_fastapi_endpoint_url
   ```

4. **Database Setup**
   - Set up MongoDB Atlas cluster
   - Create collections: `activities`, `airesponses`, `rooms`
   - Update connection string in environment variables

5. **Run the development server**
```bash
npm run dev
   ```

6. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 Configuration

### AI Analysis Thresholds
The system uses configurable thresholds for detecting suspicious behavior:

```python
# Key Analysis Thresholds
FAST_TYPING_THRESHOLD_MS = 50
LONG_GAP_THRESHOLD_MS = 15000
RAPID_PASTE_CTRL_V_THRESHOLD_MS = 300

# Copy Analysis Weights
WEIGHTS = {
    'length_very_short': 0,
    'length_medium': 5,
    'length_long': 15,
    'length_very_long': 25,
    'code_keywords': 20,
    'code_structure': 15,
    'specific_solution_keywords': 35
}
```

### Event Types
The system tracks various event types:
- `key_press`: Individual keystroke events
- `copy`: Content copy operations
- `paste`: Content paste operations
- `submission`: Code submission events
- `window_blurred`/`window_focused`: Window focus changes
- `tab_activated`/`tab_deactivated`: Tab switching events

## 📊 API Endpoints

### Activity Management
- `POST /api/activity` - Log new user activity
- `GET /api/activity` - Retrieve activities with pagination and filtering

### AI Analysis
- `POST /api/airesponse` - Trigger AI analysis for specific activity
- `POST /api/airesponse/check` - Check AI analysis status for multiple activities

### User Management
- `GET /api/users/[username]` - Get user-specific activity data
- `GET /api/users/search` - Search users by username

### Room Management
- `GET /api/room` - List and search rooms
- `POST /api/room` - Create new monitoring room
- `GET /api/room/[roomid]` - Get room details
- `POST /api/room/addUsers` - Add users to room

## 🎯 Usage

### For Educators/Administrators
1. **Create Monitoring Room**: Set up a room for specific coding assessments
2. **Add Participants**: Invite students to join the monitoring room
3. **Monitor Activities**: Use the dashboard to track real-time activities
4. **Review Analysis**: Examine AI-generated suspicion scores and detailed reports
5. **Export Data**: Download activity logs for further analysis

### For Students
1. **Install Chrome Extension**: Download and install the Syntax Sentry extension
2. **Join Room**: Enter room code provided by instructor
3. **Normal Coding**: Continue with regular coding practices
4. **View Results**: Access personal activity reports (if enabled)

## 🔒 Privacy & Security

- **Data Minimization**: Only collects activity data relevant to cheating detection
- **Secure Storage**: All data encrypted and stored in secure MongoDB Atlas
- **No Personal Information**: System doesn't store sensitive personal data
- **Transparent Analysis**: AI analysis methods and scoring are documented
- **User Control**: Users can request data deletion and access reports

## 🚀 Deployment

### Production Deployment
1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**
   - Connect your GitHub repository
   - Set environment variables
   - Deploy automatically on push

3. **Configure MongoDB Atlas**
   - Set up production cluster
   - Configure IP whitelist
   - Update connection strings

### Chrome Extension
The Chrome extension is available at: [GitHub Repository](https://github.com/officialSyntaxSentry/packed-extension-chrome)

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Visit our [docs section](/docs)
- **Issues**: Report bugs and request features on [GitHub Issues](https://github.com/officialSyntaxSentry/extension-web/issues)
- **Contact**: Reach out via our [contact page](/contact)

## 🔮 Roadmap

- [ ] Support for additional coding platforms (HackerRank, CodeChef)
- [ ] Advanced machine learning models for better detection
- [ ] Real-time collaboration features
- [ ] Mobile app for monitoring
- [ ] Integration with learning management systems
- [ ] Advanced reporting and analytics dashboard

## 🙏 Acknowledgments

- Built with Next.js, React, and TypeScript
- UI components powered by Radix UI and Tailwind CSS
- Database powered by MongoDB Atlas
- AI analysis implemented in Python
- Icons by Lucide React

---

**Syntax Sentry** - Making coding assessments fair, transparent, and secure for everyone.

*Currently in Alpha - Join our waitlist to be among the first to experience the platform!*
