import mongoose from "mongoose";

/**
 * Activity Schema for tracking user interactions
 */
const ActivitySchema = new mongoose.Schema({
    // Event metadata
    eventType: { 
        type: String, 
        required: true,
        enum: ['key_press','url_changed','submission','title_change', 'mouse_movement', 'copy', 'paste', 'session_created', 'session_ended', 'page_view', 'window_blurred','window_focused','tab_activated','tab_deactivated','session_started','session_ended']
    },
    timestamp: { 
        type: Date, 
        default: Date.now,
        index: true 
    },
    
    // Session information
    sessionId: { 
        type: String, 
        required: true,
        index: true
    },
    username: { 
        type: String, 
        index: true 
    },
    problemName: String,
    platform: String,
    
    // Event details (varies by event type)
    numberOfKeys: Number,
    keyLogs: Array,
    data: String,
    contentLength: Number,
    details: Object,
    
    // Page information
    page: {
        url: String,
        tabTitle: String,
        path: String,
        hostname: String
    },
    
    // Element information
    sourceElement: {
        type: String,
        id: String
    },
    targetElement: {
        type: String,
        id: String
    },
    
    // Device information
    viewportWidth: Number,
    viewportHeight: Number,
    ipAddress: String,
    userAgent: String
}, {
    timestamps: true, // Adds createdAt and updatedAt
    strict: false // Allows for flexible schema as we evolve the tracking
});

// Create indexes for common queries
ActivitySchema.index({ sessionId: 1, timestamp: 1 });
ActivitySchema.index({ username: 1, timestamp: 1 });
ActivitySchema.index({ eventType: 1, timestamp: 1 });
ActivitySchema.index({ 'page.hostname': 1 });

// Add a method to sanitize sensitive data if needed
ActivitySchema.methods.sanitize = function() {
    const sanitized = this.toObject();
    
    // Remove potentially sensitive information
    if (sanitized.data && sanitized.data.length > 100) {
        sanitized.data = sanitized.data.substring(0, 100) + '... [truncated]';
    }
    
    if (sanitized.ipAddress) {
        delete sanitized.ipAddress;
    }
    
    return sanitized;
};

// Use existing model if it exists, otherwise create a new one
export default mongoose.models.Activity || mongoose.model("Activity", ActivitySchema);
