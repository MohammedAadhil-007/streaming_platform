# Video Streaming Platform  

## Overview  
This is a project for a video streaming platform where only the admin can upload and manage content. Users can browse and watch videos with smooth playback.  

## Objective  
- Develop a basic streaming platform for videos.  
- Ensure high-quality video playback using direct `.mp4` streaming.  
- Use cloud storage for video hosting.  
- Implement a simple admin dashboard for content management.  

## Pages  

### Home Page  
- Displays available videos in a grid format.  
- Search and filter options for content discovery.  

### Video Player Page  
- Supports direct `.mp4` playback with HTML5 `<video>` player.  
- Displays video title, description, and duration.  

### Admin Dashboard  
- Upload, update, and delete videos.  
- Manage video metadata (title, description, thumbnail).  

## Technology Stack  

### Frontend  
- React.js for UI development.  
- Tailwind CSS / Bootstrap for styling.  
- React Player / HTML5 `<video>` for video playback.  

### Backend  
- Node.js with Express.js for API handling.  
- MongoDB / PostgreSQL for video metadata storage.  
- JWT Authentication for admin access.  

### Storage  
- AWS S3 / Firebase Storage / Cloudinary for video hosting.  

## Deployment  
- Vercel / Netlify for frontend hosting.  
- Render / Railway / Heroku for backend deployment.  
