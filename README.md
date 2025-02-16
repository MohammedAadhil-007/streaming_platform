# Video Streaming Platform  

## Overview  
This is a project for an video streaming platform where only the admin can upload and manage content. Users can browse and watch videos with smooth playback and adaptive streaming.  

## Objective  
- Develop a **basic Streamig platform** for streaming videos.  
- Ensure **high-quality video playback** with adaptive streaming.  
- Use **cloud storage** for video hosting.  
- Implement **a simple admin dashboard** for content management.  

## Pages  

### Home Page  
- Displays available videos in a **grid format**.  
- Search and filter options for content discovery.  

### Video Player Page  
- Supports **HLS (`.m3u8`) playback** for smooth streaming.  
- Displays **video title, description, and duration**.  

### Admin Dashboard  
- **Upload, update, and delete videos**.  
- Manage video metadata (title, description, thumbnail).  

## Technology Stack  

### Frontend  
- **React.js** for UI development.  
- **Tailwind CSS / Bootstrap** for styling.  
- **React Player / Video.js** for video playback.  

### Backend  
- **Node.js with Express.js** for API handling.  
- **MongoDB / PostgreSQL** for video metadata storage.  
- **JWT Authentication** for admin access.  

### Storage & Video Processing  
- **AWS S3 / Firebase Storage** for video hosting.  
- **FFmpeg & HLS (`.m3u8`)** for adaptive streaming.  

### Deployment  
- **Vercel / Netlify** for frontend hosting.  
- **Render / Railway / Heroku** for backend deployment.  
