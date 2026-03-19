import { FocusSession } from "../models/focusSession.model.js";

const DEFAULT_HISTORY_DAYS = 7;

export const saveCompletedFocusSession = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const { durationMinutes, mode, ambientSound = "none", startedAt, completedAt } = req.body;

		if (!durationMinutes || !mode) {
			return res.status(400).json({ message: "durationMinutes and mode are required" });
		}

		const session = await FocusSession.create({
			clerkId,
			durationMinutes,
			mode,
			ambientSound,
			startedAt,
			completedAt,
		});

		res.status(201).json(session);
	} catch (error) {
		next(error);
	}
};

export const getFocusStats = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;

		const [totals, latestSession, modeCounts] = await Promise.all([
			FocusSession.aggregate([
				{ $match: { clerkId } },
				{
					$group: {
						_id: null,
						totalFocusMinutes: { $sum: "$durationMinutes" },
						completedSessions: { $sum: 1 },
					},
				},
			]),
			FocusSession.findOne({ clerkId }).sort({ completedAt: -1 }).select("completedAt durationMinutes mode ambientSound"),
			FocusSession.aggregate([
				{ $match: { clerkId } },
				{
					$group: {
						_id: "$mode",
						count: { $sum: 1 },
					},
				},
				{ $sort: { count: -1, _id: 1 } },
				{ $limit: 1 },
			]),
		]);

		res.status(200).json({
			totalFocusMinutes: totals[0]?.totalFocusMinutes || 0,
			completedSessions: totals[0]?.completedSessions || 0,
			lastCompletedSession: latestSession,
			topMode: modeCounts[0]?._id || null,
		});
	} catch (error) {
		next(error);
	}
};

export const getFocusHistory = async (req, res, next) => {
	try {
		const clerkId = req.auth.userId;
		const days = Math.max(Number.parseInt(req.query.days, 10) || DEFAULT_HISTORY_DAYS, 1);
		const startDate = new Date();
		startDate.setHours(0, 0, 0, 0);
		startDate.setDate(startDate.getDate() - (days - 1));

		const history = await FocusSession.aggregate([
			{
				$match: {
					clerkId,
					completedAt: { $gte: startDate },
				},
			},
			{
				$group: {
					_id: {
						$dateToString: {
							format: "%Y-%m-%d",
							date: "$completedAt",
						},
					},
					minutes: { $sum: "$durationMinutes" },
					sessions: { $sum: 1 },
				},
			},
			{ $sort: { _id: 1 } },
		]);

		res.status(200).json(
			history.map((entry) => ({
				date: entry._id,
				minutes: entry.minutes,
				sessions: entry.sessions,
			}))
		);
	} catch (error) {
		next(error);
	}
};
