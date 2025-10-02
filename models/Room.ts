// import mongoose, { Document, Model, Schema } from "mongoose";

// /**
//  * Room Schema for managing user activity groups
//  */
// const RoomSchema = new mongoose.Schema({
//     // Room identifier - 5-character alphanumeric ID
//     roomId: { 
//         type: String, 
//         required: true,
//         unique: true,
//         index: true,
//         minlength: 5,
//         maxlength: 5,
//         match: /^[a-zA-Z0-9]{5}$/
//     },
    
//     // List of usernames in this room
//     usernames: [{ 
//         type: String,
//         trim: true 
//     }],
    
//     // Metadata
//     createdAt: { 
//         type: Date, 
//         default: Date.now 
//     },
//     updatedAt: { 
//         type: Date, 
//         default: Date.now 
//     }
// }, {
//     timestamps: true // Adds createdAt and updatedAt
// });

// // Create indexes for efficient querying
// RoomSchema.index({ roomId: 1 }, { unique: true });

// // Static method to generate a unique room ID
// RoomSchema.statics.generateUniqueRoomId = async function() {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
//     let roomId;
//     let isUnique = false;
    
//     // Keep generating until we find a unique ID
//     while (!isUnique) {
//         roomId = '';
//         for (let i = 0; i < 5; i++) {
//             roomId += characters.charAt(Math.floor(Math.random() * characters.length));
//         }
        
//         // Check if this ID already exists
//         const existingRoom = await this.findOne({ roomId });
//         if (!existingRoom) {
//             isUnique = true;
//         }
//     }
    
//     return roomId;
// };

// // Use existing model if it exists, otherwise create a new one
// export default mongoose.models.Room || mongoose.model("Room", RoomSchema);



// models/room.ts
import mongoose, { Document, Model, Schema } from "mongoose";

// --- 1. Define Interfaces ---

// Interface representing a single Room document (an instance of the model)
export interface IRoom extends Document {
    roomId: string;
    usernames: string[];
    // createdAt and updatedAt are automatically added by timestamps: true
    // You can include them here for type safety if you access them frequently
    createdAt: Date;
    updatedAt: Date;
}

// Interface representing the static methods of the Room Model
// This includes our custom static method `generateUniqueRoomId`
export interface IRoomModel extends Model<IRoom> {
    generateUniqueRoomId(): Promise<string>; // Specify the return type is a Promise<string>
}

// --- 2. Define the Schema using the Interfaces ---

/**
 * Room Schema for managing user activity groups
 */
const RoomSchema = new Schema<IRoom, IRoomModel>( // Apply the interfaces here
    {
        // Room identifier - 5-character alphanumeric ID
        roomId: {
            type: String,
            required: [true, 'Room ID is required'], // Added error message for clarity
            unique: true,
            index: true, // Explicit index (though unique:true usually creates one)
            minlength: [5, 'Room ID must be 5 characters long'],
            maxlength: [5, 'Room ID must be 5 characters long'],
            match: [/^[a-zA-Z0-9]{5}$/, 'Room ID must be 5 alphanumeric characters']
        },

        // List of usernames in this room
        usernames: [{
            type: String,
            trim: true
        }],

        // createdAt and updatedAt are automatically managed by the timestamps option below
        // No need to define them explicitly here unless you need custom logic
    },
    {
        timestamps: true // Automatically adds createdAt and updatedAt fields
    }
);

// --- 3. Define the Static Method ---

// Static method to generate a unique room ID
// TypeScript now knows this method exists via the IRoomModel interface
RoomSchema.statics.generateUniqueRoomId = async function(): Promise<string> { // Add return type
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomId: string | undefined;
    let isUnique = false;
    // Cast 'this' to the specific Model type within the static method
    // This tells TypeScript what 'this' refers to, allowing 'this.findOne'
    const RoomModel = this as Model<IRoom>;

    // Keep generating until we find a unique ID (add retry limit potentially)
    let retries = 0; // Optional: Prevent infinite loops
    const maxRetries = 10; // Optional: Set a limit

    while (!isUnique && retries < maxRetries) {
        roomId = '';
        for (let i = 0; i < 5; i++) {
            roomId += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        // Check if this ID already exists using the correctly typed model
        const existingRoom = await RoomModel.findOne({ roomId }).lean(); // .lean() for performance if you only need to check existence
        if (!existingRoom) {
            isUnique = true;
        }
        retries++; // Optional
    }

    if (!isUnique || !roomId) { // Optional: Handle unlikely collision/retry failure
        throw new Error("Failed to generate a unique room ID after several attempts.");
    }

    // Since the loop ensures roomId is assigned when isUnique is true,
    // we can be confident it's a string here.
    return roomId;
};

// --- 4. Create and Export the Model ---

// Check if the model already exists before defining it
// Use the IRoomModel type for type checking the existing model and the new model
const Room = (mongoose.models.Room as IRoomModel) || // Cast existing model check
             mongoose.model<IRoom, IRoomModel>("Room", RoomSchema); // Provide types when creating model

export default Room;