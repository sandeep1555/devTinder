const mongoose = require("mongoose")


const connectionRequestSchema = new mongoose.Schema({
    fromUserId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        require: true,
    },
    toUserId:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        require: true,
    },
    status:
    {
        type: String,
        require: true,
        enum: {
            values: ["ignored", "interested", "accepted", "rejected"],
            message: `{VALUE} this value is not allowed`,
        }
    }

},
    {
        timestamps: true
    })
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 })
connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("Cannot send connection request to yourself")
    }
    next();

})

const ConnectionRequest = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequest