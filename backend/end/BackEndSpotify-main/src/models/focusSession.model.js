import mongoose from "mongoose";

const focusSessionSchema = new mongoose.Schema(
	{
		clerkId: {
			type: String,
			required: true,
			index: true,
		},
		durationMinutes: {
			type: Number,
			required: true,
			min: 1,
		},
		mode: {
			type: String,
			required: true,
			enum: ["deep-focus", "revision-mode", "late-night-study"],
		},
		ambientSound: {
			type: String,
			default: "none",
			enum: ["none", "rain", "white-noise", "cafe"],
		},
		startedAt: {
			type: Date,
		},
		completedAt: {
			type: Date,
			required: true,
			default: Date.now,
			index: true,
		},
	},
	{ timestamps: true }
);

focusSessionSchema.index({ clerkId: 1, completedAt: -1 });

export const FocusSession = mongoose.model("FocusSession", focusSessionSchema);
