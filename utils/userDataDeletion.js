import mongoose from "mongoose";
import { userConnection } from "../db/database.js";
import userStocks from "../models/users/stocks.js";
import userGroups from "../models/users/groups.js";
import userSolds from "../models/users/solds.js";
import userNotes from "../models/users/notes.js";

/**
 * Deletes all user data from the database in a transaction
 * @param {string|ObjectId} userId - The user ID to delete data for
 * @returns {Promise<Object>} - Results of the deletion operation
 */
export async function deleteAllUserData(userId) {
  // Convert string ID to ObjectId if needed
  const userObjectId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  const session = await userConnection.startSession();

  try {
    const result = await session.withTransaction(async () => {
      const deletionResults = {
        userId: userObjectId.toString(),
        deletedData: {},
        totalDocumentsDeleted: 0,
        errors: [],
      };

      // Delete user stocks data
      try {
        const stocksResult = await userStocks.deleteMany(
          { user_id: userObjectId },
          { session }
        );
        deletionResults.deletedData.stocks = {
          deletedCount: stocksResult.deletedCount,
          collection: "stocks",
        };
        deletionResults.totalDocumentsDeleted += stocksResult.deletedCount;
      } catch (error) {
        deletionResults.errors.push({
          collection: "stocks",
          error: error.message,
        });
      }

      // Delete user groups data
      try {
        const groupsResult = await userGroups.deleteMany(
          { user_id: userObjectId },
          { session }
        );
        deletionResults.deletedData.groups = {
          deletedCount: groupsResult.deletedCount,
          collection: "groups",
        };
        deletionResults.totalDocumentsDeleted += groupsResult.deletedCount;
      } catch (error) {
        deletionResults.errors.push({
          collection: "groups",
          error: error.message,
        });
      }

      // Delete user solds data
      try {
        const soldsResult = await userSolds.deleteMany(
          { user_id: userObjectId },
          { session }
        );
        deletionResults.deletedData.solds = {
          deletedCount: soldsResult.deletedCount,
          collection: "solds",
        };
        deletionResults.totalDocumentsDeleted += soldsResult.deletedCount;
      } catch (error) {
        deletionResults.errors.push({
          collection: "solds",
          error: error.message,
        });
      }

      // Delete user notes data
      try {
        const notesResult = await userNotes.deleteMany(
          { user_id: userObjectId },
          { session }
        );
        deletionResults.deletedData.notes = {
          deletedCount: notesResult.deletedCount,
          collection: "notes",
        };
        deletionResults.totalDocumentsDeleted += notesResult.deletedCount;
      } catch (error) {
        deletionResults.errors.push({
          collection: "notes",
          error: error.message,
        });
      }

      // If there were any errors, abort the transaction
      if (deletionResults.errors.length > 0) {
        throw new Error(
          `Failed to delete data from collections: ${deletionResults.errors
            .map((e) => e.collection)
            .join(", ")}`
        );
      }

      return deletionResults;
    });

    return {
      success: true,
      result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error,
    };
  } finally {
    await session.endSession();
  }
}

/**
 * Gets a count of all user data before deletion (for verification)
 * @param {string|ObjectId} userId - The user ID to count data for
 * @returns {Promise<Object>} - Counts of documents in each collection
 */
export async function getUserDataCounts(userId) {
  const userObjectId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  try {
    const counts = {
      userId: userObjectId.toString(),
      stocks: await userStocks.countDocuments({ user_id: userObjectId }),
      groups: await userGroups.countDocuments({ user_id: userObjectId }),
      solds: await userSolds.countDocuments({ user_id: userObjectId }),
      notes: await userNotes.countDocuments({ user_id: userObjectId }),
    };

    counts.total = counts.stocks + counts.groups + counts.solds + counts.notes;

    return {
      success: true,
      counts,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Verifies that all user data has been deleted
 * @param {string|ObjectId} userId - The user ID to verify deletion for
 * @returns {Promise<Object>} - Verification results
 */
export async function verifyUserDataDeletion(userId) {
  const userObjectId =
    typeof userId === "string" ? new mongoose.Types.ObjectId(userId) : userId;

  try {
    const remainingData = {
      userId: userObjectId.toString(),
      stocks: await userStocks.countDocuments({ user_id: userObjectId }),
      groups: await userGroups.countDocuments({ user_id: userObjectId }),
      solds: await userSolds.countDocuments({ user_id: userObjectId }),
      notes: await userNotes.countDocuments({ user_id: userObjectId }),
    };

    const totalRemaining =
      remainingData.stocks +
      remainingData.groups +
      remainingData.solds +
      remainingData.notes;

    return {
      success: true,
      isCompletelyDeleted: totalRemaining === 0,
      remainingData,
      totalRemaining,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Safe deletion with pre-checks and verification
 * @param {string|ObjectId} userId - The user ID to delete data for
 * @param {Object} options - Options for the deletion operation
 * @returns {Promise<Object>} - Complete deletion operation results
 */
export async function safeDeleteUserData(userId, options = {}) {
  const {
    skipPreCheck = false,
    skipVerification = false,
    retryOnFailure = true,
  } = options;

  const results = {
    userId: userId.toString(),
    preCheck: null,
    deletion: null,
    verification: null,
    success: false,
  };

  try {
    // Pre-check: Get counts before deletion
    if (!skipPreCheck) {
      results.preCheck = await getUserDataCounts(userId);
      if (!results.preCheck.success) {
        throw new Error(`Pre-check failed: ${results.preCheck.error}`);
      }
    }

    // Perform deletion
    results.deletion = await deleteAllUserData(userId);
    if (!results.deletion.success) {
      if (retryOnFailure) {
        // Retry once on failure
        console.log("Retrying deletion operation...");
        results.deletion = await deleteAllUserData(userId);
      }

      if (!results.deletion.success) {
        throw new Error(`Deletion failed: ${results.deletion.error}`);
      }
    }

    // Post-deletion verification
    if (!skipVerification) {
      results.verification = await verifyUserDataDeletion(userId);
      if (!results.verification.success) {
        throw new Error(`Verification failed: ${results.verification.error}`);
      }

      if (!results.verification.isCompletelyDeleted) {
        throw new Error(
          `Deletion incomplete: ${results.verification.totalRemaining} documents remaining`
        );
      }
    }

    results.success = true;
    return results;
  } catch (error) {
    results.error = error.message;
    results.success = false;
    return results;
  }
}
