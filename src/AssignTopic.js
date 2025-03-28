import { db, collection, getDocs, updateDoc, doc } from "../src/firebase.js";

// Script to reassign IDs to all problems starting from 1
const reassignAllIds = async () => {
  try {
    // Step 1: Fetch all problems
    const querySnapshot = await getDocs(collection(db, "leetcodequestions"));
    const problems = querySnapshot.docs.map((doc) => ({
      docId: doc.id, // Firestore document ID
      ...doc.data(), // Document data (title, id, etc.)
    }));

    if (problems.length === 0) {
      console.log("No problems found in the database.");
      return;
    }

    // Step 2: Sort problems (optional, based on current ID or another field)
    // Here, we sort by the existing ID (if it exists) or by title as a fallback
    problems.sort((a, b) => {
      const idA = a.id !== undefined && !isNaN(a.id) ? a.id : Infinity;
      const idB = b.id !== undefined && !isNaN(b.id) ? b.id : Infinity;
      if (idA !== idB) return idA - idB; // Sort by ID if available
      return a.title.localeCompare(b.title); // Otherwise, sort by title
    });

    // Step 3: Reassign IDs starting from 1
    let newId = 1;
    for (const problem of problems) {
      console.log(`Assigning new ID ${newId} to problem: ${problem.title}`);
      await updateDoc(doc(db, "leetcodequestions", problem.docId), {
        id: newId,
      });
      newId++; // Increment the ID for the next problem
    }

    console.log("Finished reassigning IDs to all problems.");
  } catch (error) {
    console.error("Error reassigning IDs:", error.message);
  }
};

// Run the script
reassignAllIds();
