import {
  deleteAllUserData,
  getUserDataCounts,
  verifyUserDataDeletion,
  safeDeleteUserData,
} from "./userDataDeletion.js";

/**
 * Example usage of the user data deletion utilities
 * This file demonstrates how to use the functions but should not be run in production
 */

// Example 1: Get user data counts before deletion
export async function exampleGetUserDataCounts(userId) {
  console.log(`\n=== Getting data counts for user: ${userId} ===`);

  const result = await getUserDataCounts(userId);

  if (result.success) {
    console.log("User data counts:", result.counts);
    console.log(`Total documents: ${result.counts.total}`);
  } else {
    console.error("Failed to get user data counts:", result.error);
  }

  return result;
}

// Example 2: Basic user data deletion
export async function exampleBasicDeletion(userId) {
  console.log(`\n=== Performing basic deletion for user: ${userId} ===`);

  const result = await deleteAllUserData(userId);

  if (result.success) {
    console.log("Deletion successful!");
    console.log("Deleted data:", result.result.deletedData);
    console.log(
      `Total documents deleted: ${result.result.totalDocumentsDeleted}`
    );
  } else {
    console.error("Deletion failed:", result.error);
  }

  return result;
}

// Example 3: Verify deletion was complete
export async function exampleVerifyDeletion(userId) {
  console.log(`\n=== Verifying deletion for user: ${userId} ===`);

  const result = await verifyUserDataDeletion(userId);

  if (result.success) {
    if (result.isCompletelyDeleted) {
      console.log("✅ All user data successfully deleted!");
    } else {
      console.log("❌ Some data still remains:");
      console.log("Remaining data:", result.remainingData);
      console.log(`Total remaining documents: ${result.totalRemaining}`);
    }
  } else {
    console.error("Verification failed:", result.error);
  }

  return result;
}

// Example 4: Safe deletion with all checks (recommended approach)
export async function exampleSafeDeletion(userId) {
  console.log(`\n=== Performing safe deletion for user: ${userId} ===`);

  const result = await safeDeleteUserData(userId, {
    skipPreCheck: false,
    skipVerification: false,
    retryOnFailure: true,
  });

  if (result.success) {
    console.log("✅ Safe deletion completed successfully!");

    if (result.preCheck) {
      console.log("Pre-deletion counts:", result.preCheck.counts);
    }

    if (result.deletion) {
      console.log("Deletion results:", result.deletion.result.deletedData);
    }

    if (result.verification) {
      console.log("Post-deletion verification: All data removed");
    }
  } else {
    console.error("❌ Safe deletion failed:", result.error);

    // Show which step failed
    if (result.preCheck && !result.preCheck.success) {
      console.error("Pre-check failed:", result.preCheck.error);
    }
    if (result.deletion && !result.deletion.success) {
      console.error("Deletion failed:", result.deletion.error);
    }
    if (result.verification && !result.verification.success) {
      console.error("Verification failed:", result.verification.error);
    }
  }

  return result;
}

// Example 5: Complete workflow demonstration
export async function exampleCompleteWorkflow(userId) {
  console.log(`\n=== Complete User Data Deletion Workflow ===`);
  console.log(`User ID: ${userId}`);

  try {
    // Step 1: Check what data exists
    console.log("\n📊 Step 1: Checking existing data...");
    const preCheck = await getUserDataCounts(userId);

    if (!preCheck.success) {
      throw new Error(`Pre-check failed: ${preCheck.error}`);
    }

    if (preCheck.counts.total === 0) {
      console.log("ℹ️  No data found for this user");
      return { success: true, message: "No data to delete" };
    }

    console.log(
      `Found ${preCheck.counts.total} documents to delete:`,
      preCheck.counts
    );

    // Step 2: Perform safe deletion
    console.log("\n🗑️  Step 2: Performing deletion...");
    const deletion = await safeDeleteUserData(userId);

    if (!deletion.success) {
      throw new Error(`Deletion failed: ${deletion.error}`);
    }

    console.log("✅ Deletion completed successfully!");

    // Step 3: Final verification
    console.log("\n✅ Step 3: Final verification...");
    const verification = await verifyUserDataDeletion(userId);

    if (!verification.success) {
      throw new Error(`Verification failed: ${verification.error}`);
    }

    if (!verification.isCompletelyDeleted) {
      throw new Error(
        `Deletion incomplete: ${verification.totalRemaining} documents remaining`
      );
    }

    console.log("🎉 User data deletion completed successfully!");
    return { success: true, result: deletion };
  } catch (error) {
    console.error("❌ Workflow failed:", error.message);
    return { success: false, error: error.message };
  }
}

// // Usage examples (commented out to prevent accidental execution)

// // Example usage:
// async function runExamples() {
//   const testUserId = "userId"; // Replace with actual user ID

//   // Get data counts
//   await exampleGetUserDataCounts(testUserId);

//   // Perform safe deletion
//   await exampleSafeDeletion(testUserId);

//   // Or run the complete workflow
//   await exampleCompleteWorkflow(testUserId);
// }

// // Uncomment to run examples (BE CAREFUL - this will delete data!)
// runExamples().catch(console.error);
