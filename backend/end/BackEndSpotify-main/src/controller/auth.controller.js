import { User } from "../models/user.model.js";

export const authCallback = async (req, res, next) => {
	try {
		const { id, firstName, lastName, imageUrl } = req.body;
		const fallbackName = firstName || lastName ? `${firstName || ""} ${lastName || ""}`.trim() : "StudyStream User";

		await User.findOneAndUpdate(
			{ clerkId: id },
			{
				clerkId: id,
				fullName: fallbackName,
				imageUrl,
			},
			{
				new: true,
				upsert: true,
				setDefaultsOnInsert: true,
			}
		);

		res.status(200).json({ success: true });
	} catch (error) {
		console.log("Error in auth callback", error);
		next(error);
	}
};
